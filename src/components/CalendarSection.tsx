import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Bookmark, ChevronLeft, ChevronRight, BookOpen, Clock, Sparkles, User, ArrowLeft } from 'lucide-react';
import { LiturgicalDay, Prayer, Saint, OfficeReading } from '../types';

export const formatDateToDDMMYYYY = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

interface CalendarSectionProps {
  liturgicalDays: LiturgicalDay[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  language: 'ta' | 'en';
  fontSizeClass: string;
  onToggleBookmark: (id: string, titleEn: string, titleTa: string) => void;
  isBookmarked: (id: string) => boolean;
  prayers?: Prayer[];
  saints?: Saint[];
  officeReadings?: OfficeReading[];
  externalSourceLabel?: string;
}

type SubTabType = 'readings' | 'prayers' | 'saint' | 'office';
type PrayersHourType = 'morning' | 'noon' | 'evening' | 'night' | 'office';

// ----------------------------------------------------------------------
// HELPER UTILITIES FOR DETERMINISTIC LITURGICAL & SAINT GENERATION
// ----------------------------------------------------------------------

const getSeedString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getRandomItem = <T,>(list: T[], seed: number): T => {
  return list[seed % list.length];
};

// Procedural generator to ensure every single day of the year has beautiful readings
const getDeterministicLiturgicalDay = (dateStr: string, currentLitDays: LiturgicalDay[], officeReadings?: OfficeReading[]): LiturgicalDay => {
  const match = currentLitDays.find((d) => d.date === dateStr);
  if (match) return match;

  const parts = dateStr.split('-');
  const yearNum = parseInt(parts[0], 10) || 2026;
  const monthNum = parseInt(parts[1], 10) || 6;
  const dayNum = parseInt(parts[2], 10) || 19;
  
  const seed = getSeedString(dateStr);

  // Approximate Catholic Liturgical Seasons based on calendar dates
  let seasonEn = 'Ordinary Time';
  let seasonTa = 'சாதாரண காலம்';
  let color = 'green';
  
  if (monthNum === 12) {
    if (dayNum <= 24) {
      seasonEn = 'Advent';
      seasonTa = 'வருகைக் காலம்';
      color = 'purple';
    } else {
      seasonEn = 'Christmas';
      seasonTa = 'கிறிஸ்துமஸ் காலம்';
      color = 'white';
    }
  } else if (monthNum === 1) {
    if (dayNum <= 6) {
      seasonEn = 'Christmas';
      seasonTa = 'கிறிஸ்துமஸ் காலம்';
      color = 'white';
    }
  } else if (monthNum === 2 && dayNum >= 18) {
    seasonEn = 'Lent';
    seasonTa = 'தவக் காலம்';
    color = 'purple';
  } else if (monthNum === 3) {
    seasonEn = 'Lent';
    seasonTa = 'தவக் காலம்';
    color = 'purple';
  } else if (monthNum === 4) {
    if (dayNum <= 4) {
      seasonEn = 'Lent';
      seasonTa = 'தவக் காலம்';
      color = 'purple';
    } else {
      seasonEn = 'Easter';
      seasonTa = 'பாஸ்கா காலம்';
      color = 'white';
    }
  } else if (monthNum === 5 && dayNum <= 24) {
    seasonEn = 'Easter';
    seasonTa = 'பாஸ்கா காலம்';
    color = 'white';
  }

  // Handle high festivals on specific days
  if (monthNum === 8 && dayNum === 15) {
    seasonEn = 'Assumption';
    seasonTa = 'விண்ணேற்பு பெருவிழா';
    color = 'white';
  } else if (monthNum === 11 && (dayNum === 1 || dayNum === 2)) {
    seasonEn = 'All Saints / Souls';
    seasonTa = 'அனைத்து புனிதர் நினைவு';
    color = 'white';
  }

  const weekdayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayNamesTa = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
  const dow = new Date(dateStr).getDay();
  const dayOfWeekEn = weekdayNamesEn[dow];
  const dayOfWeekTa = weekdayNamesTa[dow];

  let feastEn = `${dayOfWeekEn} in ${seasonEn}`;
  let feastTa = `${seasonTa} - ${dayOfWeekTa}`;

  if (seasonEn === 'Ordinary Time') {
    const weekNum = (seed % 34) + 1;
    const ordinalsEn = [
      'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
      'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth',
      'Eighteenth', 'Nineteenth', 'Twentieth', 'Twenty-First', 'Twenty-Second', 'Twenty-Third',
      'Twenty-Fourth', 'Twenty-Fifth', 'Twenty-Sixth', 'Twenty-Seventh', 'Twenty-Eighth', 'Twenty-Ninth',
      'Thirtieth', 'Thirty-First', 'Thirty-Second', 'Thirty-Third', 'Thirty-Fourth'
    ];
    const ordinalsTa = [
      'முதல்', 'இரண்டாம்', 'மூன்றாம்', 'நான்காம்', 'ஐந்தாம்', 'ஆறாம்', 'ஏழாம்', 'எட்டாம்', 'ஒன்பதாம்', 'பத்தாம்',
      'பதினொன்றாம்', 'பன்னிரண்டாம்', 'பதிமூன்றாம்', 'பதினான்காம்', 'பதினைந்தாம்', 'பதினாறாம்', 'பதினேழாம்',
      'பதினெட்டாம்', 'பத்தொன்பதாம்', 'இருபதாம்', 'இருபத்தொன்றாம்', 'இருபத்திரண்டாம்', 'இருபத்துமூன்றாம்',
      'இருபத்துநான்காம்', 'இருபத்தைந்தாம்', 'இருபத்தாறாம்', 'இருபத்தேழாம்', 'இருபத்தெட்டாம்', 'இருபத்தொன்பதாம்',
      'முப்பதாம்', 'முப்பத்தொன்றாம்', 'முப்பத்திரண்டாம்', 'முப்பத்துமூன்றாம்', 'முப்பத்துநான்காம்'
    ];
    const ordinalEn = ordinalsEn[weekNum - 1];
    const ordinalTa = ordinalsTa[weekNum - 1];
    feastEn = `${dayOfWeekEn} of the ${ordinalEn} Week in Ordinary Time`;
    feastTa = `சாதாரண காலத்தின் ${ordinalTa} வாரத்தின் ${dayOfWeekTa}`;
  } else if (seasonEn === 'Advent') {
    const weekNum = (seed % 4) + 1;
    const ordEn = weekNum === 1 ? 'First' : weekNum === 2 ? 'Second' : weekNum === 3 ? 'Third' : 'Fourth';
    const ordTa = weekNum === 1 ? 'முதல்' : weekNum === 2 ? 'இரண்டாம்' : weekNum === 3 ? 'மூன்றாம்' : 'நான்காம்';
    feastEn = `${dayOfWeekEn} of the ${ordEn} Week of Advent`;
    feastTa = `வருகைக் காலத்தின் ${ordTa} வாரத்தின் ${dayOfWeekTa}`;
  } else if (seasonEn === 'Lent') {
    const weekNum = (seed % 6) + 1;
    const ordEn = weekNum === 1 ? 'First' : weekNum === 2 ? 'Second' : weekNum === 3 ? 'Third' : weekNum === 4 ? 'Fourth' : weekNum === 5 ? 'Fifth' : 'Holy';
    const ordTa = weekNum === 1 ? 'முதல்' : weekNum === 2 ? 'இரண்டாம்' : weekNum === 3 ? 'மூன்றாம்' : weekNum === 4 ? 'நான்காம்' : weekNum === 5 ? 'ஐந்தாம்' : 'புனித';
    feastEn = `${dayOfWeekEn} of the ${ordEn} Week of Lent`;
    feastTa = `தவக் காலத்தின் ${ordTa} வாரத்தின் ${dayOfWeekTa}`;
  } else if (seasonEn === 'Easter') {
    const weekNum = (seed % 7) + 1;
    const ordEn = weekNum === 1 ? 'First' : weekNum === 2 ? 'Second' : weekNum === 3 ? 'Third' : weekNum === 4 ? 'Fourth' : weekNum === 5 ? 'Fifth' : weekNum === 6 ? 'Sixth' : 'Seventh';
    const ordTa = weekNum === 1 ? 'முதல்' : weekNum === 2 ? 'இரண்டாம்' : weekNum === 3 ? 'மூன்றாம்' : weekNum === 4 ? 'நான்காம்' : weekNum === 5 ? 'ஐந்தாம்' : weekNum === 6 ? 'ஆறாம்' : 'ஏழாம்';
    feastEn = `${dayOfWeekEn} of the ${ordEn} Week of Easter`;
    feastTa = `பாஸ்கா காலத்தின் ${ordTa} வாரத்தின் ${dayOfWeekTa}`;
  } else if (seasonEn === 'Assumption') {
    feastEn = 'The Assumption of the Blessed Virgin Mary - Solemnity';
    feastTa = 'விண்ணேற்பு அன்னை மரியாவின் பெருவிழா';
  } else if (seasonEn === 'All Saints / Souls') {
    if (dayNum === 1) {
      feastEn = 'All Saints Day - Solemnity';
      feastTa = 'அனைத்து புனிதர்களின் பெருவிழா';
    } else {
      feastEn = 'All Faithful Departed (All Souls Day) - Memorial';
      feastTa = 'இறந்தோர்க்குரிய நினைவுத் திருப்பலி';
    }
  }

  // Pre-seeded pools of scriptural text
  const firstReadingPool = [
    {
      refEn: 'Isaiah 43:1-4',
      refTa: 'எசாயா 43:1-4',
      en: `But now, this is what the Lord says—he who created you, Jacob, he who formed you, Israel: "Do not fear, for I have redeemed you; I have summoned you by name; you are mine. When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you..."`,
      ta: `இப்போது, யாக்கோபைப் படைத்தவரும் இஸ்ரயேலை உருவாக்கியவருமான ஆண்டவர் உரைப்பது இதுவே: "அஞ்சாதே, ஏனெனில் உன்னை நான் மீட்டுக் கொண்டேன்; உன்னைப் பெயர் சொல்லி அழைத்தேன்; நீ எனக்குரியவன். நீ ஆழமான நீர்நிலைகளைக் கடந்து செல்லும்போது நான் உன்னோடு இருப்பேன்; ஆறுகளைக் கடக்கும்போது அவை உன்மேல் பொங்கி வழியமாட்டா..."`
    },
    {
      refEn: 'Ephesians 2:4-10',
      refTa: 'எபெசியர் 2:4-10',
      en: `But because of his great love for us, God, who is rich in mercy, made us alive with Christ even when we were dead in transgressions—it is by grace you have been saved. And God raised us up with Christ and seated us with him in the heavenly realms in Christ Jesus...`,
      ta: `ஆனால், இரக்கத்தின் செல்வரான கடவுள் நம்மீது கொண்ட பெரும் அன்பின் காரணமாக, நாம் குற்றங்களால் செத்துப்போனவர்காய் இருந்தபோதிலும், கிறிஸ்துவோடு நம்மை உயிர்பெறச் செய்தார்—அவரது அருளாலேயே நீங்கள் மீட்கப்பட்டீர்கள். அவர் கிறிஸ்து இயேசுவோடு நம்மை உயிர்ப்பித்து எழுப்பி, அவரோடு விண்ணகத்தில் வீற்றிருக்கச் செய்தார்...`
    },
    {
      refEn: '1 John 4:7-12',
      refTa: '1 யோவான் 4:7-12',
      en: `Dear friends, let us love one another, for love comes from God. Everyone who loves has been born of God and knows God. Whoever does not love does not know God, because God is love. This is how God showed his love among us: He sent his one and only Son into the world that we might live through him.`,
      ta: `அன்பானவர்களே, நாம் ஒருவரிடம் ஒருவர் அன்பு செலுத்துவோமாக. ஏனெனில் அன்பு கடவுளிடமிருந்தே வருகிறது. அன்பு செலுத்தும் அனைவரும் கடவுளிடமிருந்து பிறந்தவர்கள்; அவர்கள் கடவுளை அறிந்திருக்கிறார்கள். அன்பற்றவர் கடவுளை அறியாதவர்; ஏனெனில் கடவுள் அன்பாகவே இருக்கிறார். கடவுள் உம்மீது வைத்த அன்பை இதில்தான் வெளிப்படுத்தினார்: நாம் அவருடைய திருமகன் வழியாக வாழ்வு பெறும்படி அவர் அவரை உலகிற்கு அனுப்பினார்.`
    },
    {
      refEn: 'Genesis 12:1-4a',
      refTa: 'தொடக்க நூல் 12:1-4a',
      en: `The Lord had said to Abram, "Go from your country, your people and your father’s household to the land I will show you. I will make you into a great nation, and I will bless you; I will make your name great, and you will be a blessing..." So Abram went, as the Lord had told him.`,
      ta: `ஆண்டவர் ஆபிராமை நோக்கி: "நீ உனது நாட்டையும் உன் இனத்தையும் உன் தந்தை வீட்டையும் விட்டுப் புறப்பட்டு நான் உனக்குக் காட்டும் நாட்டிற்குப் போ. உன்னை நான் ஒரு பெரிய இனமாக்குவேன்; உனக்கு ஆசி வழங்கி, உன் பெயரைப் பெருமையடையச் செய்வேன்; நீ மற்றவருக்கு ஆசியாக விளங்குவாய்..." என்றார். ஆண்டவர் கூறியவாறே ஆபிராம் புறப்பட்டுச் சென்றார்.`
    }
  ];

  const psalmPool = [
    {
      refEn: 'Psalm 23:1-4, 6',
      refTa: 'திருப்பாடல் 23:1-4, 6',
      en: `The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name’s sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.`,
      ta: `ஆண்டவரே என் ஆயர்; எனக்கேதும் குறையில்லை. பசுமையான புல்வெளிகளில் அவர் என்னை இளைப்பாறச் செய்கிறார்; அமைதியான நீர்நிலைகளுக்கு அருகில் என்னை வழிநடத்துகிறார்; என் ஆன்மாவை உயிர்ப்பிக்கிறார். அவர் தம் பெயரின் பொருட்டு என்னை நேர்மையான பாதையில் வழிநடத்துகிறார். சாவின் இருள் சூழ்ந்த பள்ளத்தாக்கில் நான் நடக்க நேர்ந்தாலும், எத்தீங்கிற்கும் அஞ்சமாட்டேன்; ஏனெனில் நீர் என்னோடு இருக்கிறீர்.`
    },
    {
      refEn: 'Psalm 103:1-4, 8, 13',
      refTa: 'திருப்பாடல் 103:1-4, 8, 13',
      en: `Praise the Lord, my soul; all my inmost being, praise his holy name. Praise the Lord, my soul, and forget not all his benefits—who forgives all your sins and heals all your diseases... The Lord is compassionate and gracious, slow to anger, abounding in love.`,
      ta: `என் உள்ளமே, ஆண்டவரைப் போற்று; என் முழு அகமே, அவரது தூய பெயரைப் போற்று. என் உள்ளமே, ஆண்டவரைப் போற்று; அவருடைய நன்மைகள் எதையும் மறவாதே. அவர் உனது பாவங்கள் யாவற்றையும் மன்னிக்கிறார்; உனது நோய்கள் அனைத்தையும் குணமாக்குகிறார்; ஆண்டவர் இரக்கமும் அருளும் உடையவர்; சினங்கொள்ளத் தாமதிப்பவர்; பேரன்பு மிக்கவர்.`
    },
    {
      refEn: 'Psalm 46:1-3, 10-11',
      refTa: 'திருப்பாடல் 46:1-3, 10-11',
      en: `God is our refuge and strength, an ever-present help in trouble. Therefore we will not fear, though the earth give way and the mountains fall into the heart of the sea... He says, "Be still, and know that I am God; I will be exalted among the nations..."`,
      ta: `கடவுள் நமது கேடயமும் ஆற்றலுமாய் இருக்கிறார். துன்ப வேளையில் எளிதில் நமக்குத் துணைபுரிபவர் அவரே. எனவே நிலம் பெயர்ந்தாலும், மலைகள் கடலில் சரிந்தாலும் நாம் அஞ்சமாட்டோம். அவர் உரைக்கின்றார்: "அமைதியாயிருங்கள்; நானே கடவுள் என்று அறிந்துகொள்ளுங்கள்; பிற இனத்தாரிடையே நான் மாட்சியுறுவேன்..."`
    }
  ];

  const gospelPool = [
    {
      refEn: 'John 10:11-15',
      refTa: 'யோவான் 10:11-15',
      en: `Jesus said: "I am the good shepherd. The good shepherd lays down his life for the sheep. The hired hand is not the shepherd and does not own the sheep. So when he sees the wolf coming, he abandons the sheep and runs away... I know my sheep and my sheep know me—just as the Father knows me and I know the Father—and I lay down my life for the sheep."`,
      ta: `இயேசு கூறியது: "நல்ல ஆயன் நானே. நல்ல ஆயன் தன் ஆடுகளுக்காகத் தன் உயிரைக் கொடுப்பான். கூலிக்கு வேலை செய்பவர் ஆயனும் அல்ல, ஆடுகளுக்குச் சொந்தக்காரரும் அல்ல. ஓநாய் வருவதைக் காணும்போது அவர் ஆடுகளைக் கைவிட்டுவிட்டு ஓடிப்போகிறார்... நான் என் ஆடுகளை அறிந்திருக்கிறேன், என் ஆடுகளும் என்னை அறிந்திருக்கின்றன; தந்தை என்னை அறிந்திருப்பதுபோலவும் நான் தந்தையை அறிந்திருப்பதுபோலவும் நானும் என் ஆடுகளுக்காக எனது உயிரைக் கொடுக்கிறேன்."`
    },
    {
      refEn: 'Matthew 5:1-9',
      refTa: 'மத்தேயு 5:1-9',
      en: `Now when Jesus saw the crowds, he went up on a mountainside and sat down... He began to teach them: "Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who mourn, for they will be comforted. Blessed are the meek, for they will inherit the earth. Blessed are the peacemakers, for they will be called children of God..."`,
      ta: `இயேசு திரண்டிருந்த மக்களைக் கண்டு மலையேறிச் சென்று அமர்ந்தார்... அவர் போதிக்கத் தொடங்கி உரைத்தது: "ஏழையினத்தாராய் வாழ்வோரின் ஆன்மா பேறுபெற்றது; ஏனெனில் விண்ணரசு அவர்களுக்குரியது. துயருறுவோர் பேறுபெற்றோர்; ஏனெனில் அவர்கள் ஆறுதல் பெறுவர். கனிவுடையோர் பேறுபெற்றோர்; ஏனெனில் அவர்கள் மண்ணுலகை உரிமையாக்கிக் கொள்வர். அமைதி ஏற்படுத்துவோர் பேறுபெற்றோர்; ஏனெனில் அவர்கள் கடவுளின் மக்கள் என அழைக்கப்படுவர்..."`
    },
    {
      refEn: 'Mark 4:35-41',
      refTa: 'மாற்கு 4:35-41',
      en: `That day when evening came, Jesus said to his disciples, "Let us go over to the other side." ... A furious squall came up, and the waves broke over the boat... Jesus got up, rebuked the wind and said to the waves, "Quiet! Be still!" Then the wind died down and it was completely calm. He said, "Why are you so afraid? Do you still have no faith?"`,
      ta: `அன்று மாலைப் பொழுதானபோது இயேசு தம் சீடர்களிடம்: "அக்கரைக்குச் செல்வோம்" என்றார்... அதற்குள் பெரும் புயல் வீசியது, அலைகள் படகின்மேல் மோதி படகில் தண்ணீர் நிறையத் தொடங்கியது... இயேசு விழித்தெழுந்து காற்றைக் கடிந்துகொண்டார்; கடலைப் பார்த்து: "அமைதியாயிரு! அமைதி கொள்!" என்றார். உடனே காற்று அடங்கியது; பெரும் அமைதி ஏற்பட்டது. அவர் அவர்களிடம்: "ஏன் இப்படி அஞ்சுகிறீர்கள்? உங்களுக்கு இன்னும் நம்பிக்கை இல்லையா?" என்றார்.`
    }
  ];

  const fallbackOfficePool = [
    {
      refEn: 'From the Confessions of St. Augustine, Bishop & Doctor',
      refTa: 'புநில அகஸ்டின் எழுதிய "அறிக்கைகள்" நூலிலிருந்து',
      en: `You have made us for yourself, O Lord, and our heart is restless until it rests in You. In adversity, let me seek Your light; in prosperity, let me sing Your praise. You are the ultimate truth, the source of all holiness, and the lover of our souls. Guide us as we walk through this pilgrim life on earth.`,
      ta: `ஆண்டவரே, நீர் எங்களை உமக்காகவே படைத்தீர்; எங்கள் உள்ளம் உம்மில் ஓய்வுகொள்ளும் வரை அமைதியற்றிருக்கும். துன்ப நேரங்களில் உமது ஒளியைத் தேடவும், இன்ப நேரங்களில் உமக்குப் புகழ் பாடவும் எங்களுக்குக் கற்றுத்தாரும். நீரே இறுதி உண்மை, பரிசுத்தத்தின் ஊற்று, எங்கள் ஆன்மாவின் நேசர்.`
    },
    {
      refEn: 'From a pastoral letter by St. Francis de Sales, Bishop',
      refTa: 'புனித பிரான்சிஸ் டி சேல்ஸ் எழுதிய அருட்பணி கடிதத்திலிருந்து',
      en: `Do not look forward in fear to the changes in this life; rather look to them with full hope that as they arise, God, whose very own you are, will deliver you out of them. He has kept you until now, and He will lead you safely through all things. Be at peace, and set aside all anxious thoughts.`,
      ta: `இவ்வாழ்வில் ஏற்படும் மாற்றங்களை எண்ணி பயத்துடன் எதிர்நோக்க வேண்டாம்; மாறாக, கடவுள் உங்களைப் பாதுகாப்பார் என்ற முழு நம்பிக்கையோடு அவற்றை நோக்குங்கள். அவர் உங்களை இதுவரை பாதுகாத்தவர்; இனிமேலும் எல்லாவற்றிலும் பத்திரமாக வழிநடத்துவார். மனதை அமைதியாக வைத்துக்கொள்ளுங்கள், வீண் கவலைகளைக் களைந்துவிடுங்கள்.`
    }
  ];

  const activeOfficePool = (officeReadings && officeReadings.length > 0)
    ? officeReadings.map(o => ({ refEn: o.refEn, refTa: o.refTa, en: o.textEn, ta: o.textTa }))
    : fallbackOfficePool;

  const rndFirst = getRandomItem(firstReadingPool, seed);
  const rndPsalm = getRandomItem(psalmPool, seed);
  const rndGospel = getRandomItem(gospelPool, seed);
  const rndOffice = getRandomItem(activeOfficePool, seed);

  return {
    date: dateStr,
    seasonEn,
    seasonTa,
    color,
    feastEn,
    feastTa,
    readingFirstRefEn: rndFirst.refEn,
    readingFirstRefTa: rndFirst.refTa,
    readingFirstEn: rndFirst.en,
    readingFirstTa: rndFirst.ta,
    psalmRefEn: rndPsalm.refEn,
    psalmRefTa: rndPsalm.refTa,
    psalmEn: rndPsalm.en,
    psalmTa: rndPsalm.ta,
    gospelRefEn: rndGospel.refEn,
    gospelRefTa: rndGospel.refTa,
    gospelEn: rndGospel.en,
    gospelTa: rndGospel.ta,
    officeRefEn: rndOffice.refEn,
    officeRefTa: rndOffice.refTa,
    officeEn: rndOffice.en,
    officeTa: rndOffice.ta,
    isCustom: false
  };
};

const getDeterministicSaint = (dateStr: string, customSaints?: Saint[]): Omit<Saint, 'id'> => {
  const monthDay = dateStr.substring(5); // "MM-DD" e.g. "06-19"
  
  // Try to find a custom match
  const match = customSaints?.find((s) => s.feastDate === monthDay);
  if (match) return match;

  const seed = getSeedString(dateStr);

  const saintList = [
    {
      nameEn: 'St. Thomas the Apostle',
      nameTa: 'புனித தோமா, திருத்தூதர்',
      feastDate: '07-03',
      lifeHistoryEn: 'Saint Thomas, one of the Twelve Apostles, is famously known for his doubt before seeing the resurrected Christ. He traveled to India in 52 AD, preaching the Gospel and baptizing, and was martyred near Mylapore, Chennai. He is the patron saint of India and double-minded searchers.',
      lifeHistoryTa: 'பன்னிரு திருத்தூதர்களில் ஒருவரான புனித தோமா, இயேசுவின் உயிர்த்தெழுதலின் போது கொண்ட வியத்தகு சந்தேகத்தின் காரணமாக புகழ்பெற்றவர். கி.பி 52-இல் நற்செய்திப் பணிக்காக இந்தியாவிற்கு வந்து, சென்னை மைலாப்பூர் அருகே மறைசாட்சியாக உயிர் நீத்தார். இவர் இந்தியாவின் பாதுகாவலர் ஆவார்.',
      imageUrl: 'https://images.unsplash.com/photo-1548625361-155deee2614a?w=400&auto=format&fit=crop&q=60'
    },
    {
      nameEn: 'St. Anthony of Padua',
      nameTa: 'பதுவா நகர் புனித அந்தோணியார்',
      feastDate: '06-13',
      lifeHistoryEn: 'St. Anthony was a Franciscan friar of incredible theological knowledge and supernatural oratorical power. He is widely sought as the finder of lost items and helper of the poor, widely venerated in South India.',
      lifeHistoryTa: 'புனித அந்தோணியார் பிரான்சிஸ்கன் சபையைச் சார்ந்த புகழ்பெற்ற போதகரும் மறைவல்லுநரும் ஆவார். காணாமல் போன பொருட்களைக் கண்டடைய உதவுபவராகவும், ஏழைகளின் தோழராகவும் விளங்கி, எண்ணற்ற புதுமைகளை நிகழ்த்தியவர்.',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=60'
    },
    {
      nameEn: 'St. Thérèse of Lisieux (Little Flower)',
      nameTa: 'குழந்தை இயேசுவின் புனித தெரசா',
      feastDate: '10-01',
      lifeHistoryEn: 'St. Thérèse lived as a cloistered Carmelite nun in Lisieux, France. Her spiritual memoir, "The Story of a Soul," teaches the "Little Way"—doing ordinary chores and actions with extraordinary love. She is a co-patroness of missions.',
      lifeHistoryTa: 'பிரான்ஸ் நாட்டின் கார்மேல் மடத்தில் எளிய வாழ்வு வாழ்ந்தவர். அவரது கவிதைகளும் "ஆன்மாவின் வரலாறு" என்ற வரலாற்று நூலும் ஆன்மீகத்தின் எளிய சிறு வழியைக் கற்றுத்தருகின்றன. இவர் மறைபரப்பு உலகிற்கு சிறந்த வழிகாட்டி.',
      imageUrl: 'https://images.unsplash.com/photo-1601314002592-b873038687ea?w=400&auto=format&fit=crop&q=60'
    },
    {
      nameEn: 'St. Francis Xavier, Priest',
      nameTa: 'புனித பிரான்சிஸ் சவேரியார், குரு',
      feastDate: '12-03',
      lifeHistoryEn: 'St. Francis Xavier was a co-founder of the Jesuits. He traveled across Southern India (including the Pearl Fishery Coast), Malacca, and Japan. He is celebrated for his missionary zeal, having baptized thousands with his own hands.',
      lifeHistoryTa: 'இயேசு சபையைத் தோற்றுவித்தவர்களில் ஒருவரான புனித பிரான்சிஸ் சவேரியார், தென்னிந்தியக் கடற்கரை யோரப் பகுதிகளில் (குறிப்பாக தூத்துக்குடி கடற்கரை) மற்றும் ஜப்பான், மலேசியா ஆகிய இடங்களில் கிறிஸ்துவின் நற்செய்தியைப் பரப்பினார்.',
      imageUrl: 'https://images.unsplash.com/photo-1548625361-155deee2614a?w=400&auto=format&fit=crop&q=60'
    },
    {
      nameEn: 'St. Joseph, Patron of the Universal Church',
      nameTa: 'புனித யோசேப்பு, திருச்சபையின் பாதுகாவலர்',
      feastDate: '03-19',
      lifeHistoryEn: 'St. Joseph was the chaste husband of the Virgin Mary and foster-father of Jesus. An exemplar of silence, integrity, and carpenter-labor, heprotected the Holy Family and remains the ultimate patron of families and a happy death.',
      lifeHistoryTa: 'புனித கன்னி மரியாவின் கணவரும், குழந்தை இயேசுவின் வளர்ப்புத் தந்தையுமானவர். அமைதியின் சிகரம், உழைப்பின் பாதுகாவலர். திருக்குடும்பத்தினைப் பாதுகாத்த இவர், அகில உலக திருச்சபையின் தலைசிறந்த பாதுகாவலராகப் போற்றப்படுகிறார்.',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=60'
    },
    {
      nameEn: 'St. Monica, Mother of St. Augustine',
      nameTa: 'புனித மோனிக்கா, கண்ணீர் தாய்',
      feastDate: '08-27',
      lifeHistoryEn: 'St. Monica is revered for her decades of faithful, tearful prayers for the conversion of her highly brilliant but pagan son, Augustine. Her faith was rewarded when Augustine was baptized by St. Ambrose and went on to become one of the Church’s greatest theologians.',
      lifeHistoryTa: 'தன் மகன் அகஸ்டினின் மனம் மாற்றத்திற்காக நீண்ட ஆண்டுகள் கண்ணீர் சிந்தி உருக்கமாக மன்றாடியவர். இவளது இடைவிடாத தியாக மன்றாட்டின் பலனாக, அவரது மகன் திருமுழுக்குப் பெற்று, கத்தோலிக்க திருச்சபையின் முக்கிய தூணாக மாறினார்.',
      imageUrl: 'https://images.unsplash.com/photo-1601314002592-b873038687ea?w=400&auto=format&fit=crop&q=60'
    },
    {
      nameEn: 'St. Augustine, Bishop of Hippo',
      nameTa: 'ஹிப்போ நகர் புனித அகஸ்டின், மறைவல்லுநர்',
      feastDate: '08-28',
      lifeHistoryEn: 'St. Augustine was one of the most influential theologians of intellectual history. After a youth of skepticism and philosophical seeking, he converted to Christ. His monumental works, "Confessions" and "City of God," remain cornerstones of Christian literature.',
      lifeHistoryTa: 'புனித மோனிக்காவின் மகனான இவர், தன் இளமைக்கால தவறான போதனைகளிலிருந்து மீண்டு திருமுழுக்குப் பெற்றார். பின் ஹிப்போ நகரின் ஆயராக உயர்த்தப்பட்டார். இவரது "அறிக்கைகள்" என்ற நூல் புகழ்பெற்ற ஆன்மீக ஆவணம்.',
      imageUrl: 'https://images.unsplash.com/photo-1548625361-155deee2614a?w=400&auto=format&fit=crop&q=60'
    }
  ];

  return getRandomItem(saintList, seed);
};

// ----------------------------------------------------------------------
// MAIN EXPORTED COMPONENT WITH INTEGRATED PILGRIM DASHBOARD
// ----------------------------------------------------------------------

export function CalendarSection({
  liturgicalDays,
  selectedDate,
  setSelectedDate,
  language,
  fontSizeClass,
  onToggleBookmark,
  isBookmarked,
  prayers,
  saints,
  officeReadings = [],
  externalSourceLabel = '',
}: CalendarSectionProps) {
  // Today's real date string for highlighting
  const todayDateStr = (() => {
    const t = new Date();
    const yy = t.getFullYear();
    const mm = (t.getMonth() + 1).toString().padStart(2, '0');
    const dd = t.getDate().toString().padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  })();

  // Visible month & year, defaulting to the selectedDate's month and year
  const [currentYear, setCurrentYear] = useState(() => {
    const parts = selectedDate.split('-');
    const parsed = parseInt(parts[0], 10);
    return isNaN(parsed) ? 2026 : parsed;
  });
  
  const [currentMonth, setCurrentMonth] = useState(() => {
    const parts = selectedDate.split('-');
    const parsed = parseInt(parts[1], 10);
    return isNaN(parsed) ? 5 : parsed - 1; // 0-indexed, so June (6) becomes 5
  });

  // Active sub-sections inside the details area
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('readings');
  // View mode toggle: calendar grid vs full detail page
  const [viewMode, setViewMode] = useState<'calendar' | 'detail'>('calendar');
  // Selected hour pill inside the Prayers sub-tab
  const [selectedPrayersHour, setSelectedPrayersHour] = useState<PrayersHourType>('morning');

  // Derive active liturgical day via the procedural fallback engine
  const activeDay = getDeterministicLiturgicalDay(selectedDate, liturgicalDays, officeReadings);

  // Derive saint of the day
  const saintOfDay = getDeterministicSaint(selectedDate, saints);

  // Derive standard hours prayers
  const mockMorning = prayers?.find((p) => p.category === 'morning') || {
    titleEn: 'Morning Prayer (Lauds)',
    titleTa: 'காலை வழிபாடு (புகழ்மாலை)',
    contentEn: 'Lord, open my lips. And my mouth shall declare your praise. Save us, Father, as this new day dawns.',
    contentTa: 'ஆண்டவரே, என் உதடுகளைத் திறந்தருளும். என் வாய் உமது புகழை எடுத்தியம்பும். விடியலில் பேரருள் தாரும்.'
  };
  const mockNoon = prayers?.find((p) => p.category === 'noon') || {
    titleEn: 'Midday Prayer (Sext)',
    titleTa: 'நண்பகல் வழிபாடு',
    contentEn: 'God, come to my assistance. Lord, make haste to help me. Grant us peace to perform our duties.',
    contentTa: 'இறைவா, எனக்குத் துணைசெய்ய எழுந்தருளும். உமது அமைதியால் எம்மைக் குளிரச்செய்யும்.'
  };
  const mockEvening = prayers?.find((p) => p.category === 'evening') || {
    titleEn: 'Evening Prayer (Vespers)',
    titleTa: 'மாலை வழிபாடு',
    contentEn: 'My soul proclaims the greatness of the Lord. Twilight falls, guide our path in Your love.',
    contentTa: 'என் ஆன்மா ஆண்டவரைப் பெருமைப்படுத்துகின்றது. மாலையில் எங்களோடு தங்கியிரும் ஆண்டவரே.'
  };
  const mockNight = prayers?.find((p) => p.category === 'night') || {
    titleEn: 'Night Prayer (Compline)',
    titleTa: 'இரவு வழிபாடு (நிறைவுமாலை)',
    contentEn: 'May the Lord grant us a restful night and peaceful death. Under His wings we find refuge.',
    contentTa: 'எல்லாம் வல்ல ஆண்டவர் நமக்கு அமைதியான இரவையும் நல்மரணத்தையும் தருவாராக. ஆமென்.'
  };

  const getPrayerForHour = (hour: PrayersHourType) => {
    switch (hour) {
      case 'morning':
        return mockMorning;
      case 'noon':
        return mockNoon;
      case 'evening':
        return mockEvening;
      case 'night':
        return mockNight;
      case 'office':
        return {
          titleEn: activeDay.officeRefEn || 'Office of Readings',
          titleTa: activeDay.officeRefTa || 'வாசகங்களின் வழிபாடு',
          contentEn: activeDay.officeEn || 'Spiritual readings and theological quotes have not been loaded for today.',
          contentTa: activeDay.officeTa || 'இன்றைய நாளுக்கான வாசகங்களின் வழிபாடு இன்னும் சேர்க்கப்படவில்லை.'
        };
    }
  };

  const activeHourPrayer = getPrayerForHour(selectedPrayersHour);

  // Sync visible calendar layout with selectedDate change
  useEffect(() => {
    const parts = selectedDate.split('-');
    const parsedY = parseInt(parts[0], 10);
    const parsedM = parseInt(parts[1], 10);
    if (!isNaN(parsedY) && !isNaN(parsedM)) {
      setCurrentYear(parsedY);
      setCurrentMonth(parsedM - 1);
    }
  }, [selectedDate]);

  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthsTa = [
    'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
    'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
  ];

  // Dynamic calendar math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Generate month days string list
  const tempDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const yy = currentYear;
    const mm = (currentMonth + 1).toString().padStart(2, '0');
    const dd = dayNum.toString().padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  });

  const getWeekDayName = (dateStr: string) => {
    const day = new Date(dateStr).getDay();
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysTa = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
    return language === 'ta' ? daysTa[day] : daysEn[day];
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setViewMode('detail');
  };

  const handleBackToCalendar = () => {
    setViewMode('calendar');
  };

  const getColorClasses = (colorName: string) => {
    switch (colorName.toLowerCase()) {
      case 'purple':
        return { bg: 'bg-purple-100 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-600' };
      case 'red':
        return { bg: 'bg-red-100 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-600' };
      case 'white':
        return { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-yellow-400' };
      case 'green':
      default:
        return { bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-600' };
    }
  };

  const activeColor = getColorClasses(activeDay.color);

  // Jump to today helper
  const handleJumpToToday = () => {
    const today = new Date();
    const yy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    setSelectedDate(`${yy}-${mm}-${dd}`);
  };

  return (
    <div className="flex flex-col h-full gap-3 text-left">
      {viewMode === 'calendar' ? (
        <>
          {/* Month Selection Header & Navigation */}
          <div className="flex flex-col gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CalendarIcon size={18} className="text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ta' ? 'வழிபாட்டு நாட்காட்டி' : 'Liturgical Calendar'}
                </span>
              </div>
              <button onClick={handleJumpToToday} className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 rounded-md transition">
                {language === 'ta' ? 'இன்று' : 'Go to Today'}
              </button>
            </div>
            <div className="flex items-center justify-between bg-slate-100/65 dark:bg-slate-900/60 px-3 py-1.5 rounded-xl">
              <button onClick={handlePrevMonth} className="p-1 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition" title="Previous Month"><ChevronLeft size={16} /></button>
              <div className="flex items-center gap-1">
                <select value={currentMonth} onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))} className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer">
                  {monthsEn.map((m, idx) => (
                    <option key={m} value={idx} className="bg-white dark:bg-stone-950 text-slate-800 dark:text-white">{language === 'ta' ? monthsTa[idx] : m}</option>
                  ))}
                </select>
                <select value={currentYear} onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))} className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer">
                  {Array.from({ length: 31 }, (_, i) => 2015 + i).map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-stone-950 text-slate-800 dark:text-white">{y}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleNextMonth} className="p-1 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition" title="Next Month"><ChevronRight size={16} /></button>
            </div>
          </div>
          {/* Grid of Days */}
          <div className="grid grid-cols-7 gap-1 text-center bg-slate-100/40 dark:bg-slate-900/20 p-2 rounded-2xl border border-slate-100 dark:border-slate-850/60">
            {(language === 'ta' ? ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']).map((h, index) => (
              <span key={index} className="text-[9px] font-bold text-slate-400 dark:text-slate-550 py-1 uppercase scale-90">{h}</span>
            ))}
            {Array.from({ length: startDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="w-full text-center" />
            ))}
            {tempDays.map((dt) => {
              const dayNum = parseInt(dt.split('-')[2], 10);
              const isSelected = selectedDate === dt;
              const isToday = todayDateStr === dt;
              const matchedDay = liturgicalDays.find((ld) => ld.date === dt);
              const liturgicalColor = matchedDay ? matchedDay.color : getDeterministicLiturgicalDay(dt, liturgicalDays, officeReadings).color;
              let dotColorClass = 'bg-emerald-500';
              if (liturgicalColor === 'purple') dotColorClass = 'bg-purple-500';
              if (liturgicalColor === 'red') dotColorClass = 'bg-red-500';
              if (liturgicalColor === 'white') dotColorClass = 'bg-yellow-400';
              return (
                <button key={dt} onClick={() => handleDayClick(dt)}
                  className={`relative py-1.5 text-xs font-semibold rounded-lg transition duration-155 flex flex-col items-center justify-center ${isSelected ? 'bg-amber-600 text-white shadow-xs scale-102 font-bold' : isToday ? 'ring-2 ring-amber-500/60 text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/20' : 'text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                  <span>{dayNum}</span>
                  <span className={`w-1 h-1 rounded-full absolute bottom-1.2 ${isSelected ? 'bg-white/80' : dotColorClass}`} />
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Back to Calendar + Date Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button onClick={handleBackToCalendar} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Back to Calendar">
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${activeColor.bg} ${activeColor.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeColor.dot}`} />
                {language === 'ta' ? activeDay.seasonTa : activeDay.seasonEn}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-480 font-semibold font-mono">
                {getWeekDayName(selectedDate)} <span className="hidden sm:inline">• {formatDateToDDMMYYYY(selectedDate)}</span>
              </span>
            </div>
            <button onClick={() => onToggleBookmark(selectedDate, activeDay.feastEn, activeDay.feastTa)}
              className={`p-1.5 rounded-lg transition ${isBookmarked(selectedDate) ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              <Bookmark size={14} fill={isBookmarked(selectedDate) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight text-center">
            {language === 'ta' ? activeDay.feastTa : activeDay.feastEn}
          </h3>
          {externalSourceLabel && (
            <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest block text-center">Source: {externalSourceLabel}</span>
          )}
          {/* 4 Subtabs: Readings, Hours, Saint, Divine Office */}
          <div className="grid grid-cols-4 gap-1 bg-[#eae3d5]/70 dark:bg-[#1f1914] p-1 rounded-xl border border-amber-200/20 shrink-0 font-sans">
            {[
              { id: 'readings', icon: BookOpen, labelEn: 'Readings', labelTa: 'வாசகம்' },
              { id: 'prayers', icon: Clock, labelEn: 'Hours', labelTa: 'சாமம்' },
              { id: 'saint', icon: Sparkles, labelEn: 'Saint', labelTa: 'புனிதர்' },
              { id: 'office', icon: BookOpen, labelEn: 'Divine Office', labelTa: 'திரு வாசகம்' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveSubTab(tab.id as SubTabType)}
                  className={`py-1.5 px-1 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition ${activeSubTab === tab.id ? 'bg-amber-700 dark:bg-amber-500 text-white dark:text-stone-950 font-extrabold shadow-2xs' : 'text-slate-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-300'}`}>
                  <Icon size={12} />
                  <span>{language === 'ta' ? tab.labelTa : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
          {/* Dynamic Content */}
          <div className="space-y-4 overflow-y-auto pr-1 flex-1" id="daily-subtab-viewer-scroller">
            {activeSubTab === 'readings' && (
              !activeDay.readingFirstEn && !activeDay.psalmEn && !activeDay.gospelEn ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 space-y-2">
                  <BookOpen size={36} className="mx-auto text-amber-300/50" />
                  <p className="text-sm font-bold text-slate-500 dark:text-stone-400">
                    {language === 'ta' ? 'இந்த நாளுக்கான வாசகங்கள் எதுவும் இல்லை' : 'No readings available for this date'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    {language === 'ta' ? 'வேறு தேதியைத் தேர்ந்தெடுக்கவும்' : 'Select a different date'}
                  </p>
                </div>
              ) : (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-0.5">{language === 'ta' ? 'முதல் வாசகம்' : 'First Reading'}</span>
                  <span className="text-xs font-semibold text-slate-805 dark:text-slate-100 block mb-2">{language === 'ta' ? activeDay.readingFirstRefTa : activeDay.readingFirstRefEn}</span>
                  <p className={`leading-relaxed font-serif whitespace-pre-wrap ${fontSizeClass}`}>{language === 'ta' ? activeDay.readingFirstTa : activeDay.readingFirstEn}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-0.5">{language === 'ta' ? 'பதிலுரைத் திருப்பாடல்' : 'Responsorial Psalm'}</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block mb-2">{language === 'ta' ? activeDay.psalmRefTa : activeDay.psalmRefEn}</span>
                  <p className={`leading-relaxed italic whitespace-pre-wrap ${fontSizeClass}`}>{language === 'ta' ? activeDay.psalmTa : activeDay.psalmEn}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[9px] font-bold text-rose-700 dark:text-rose-450 uppercase tracking-widest block mb-0.5">{language === 'ta' ? 'புனித நற்செய்தி' : 'Holy Gospel Reading'}</span>
                  <span className="text-xs font-semibold text-slate-805 dark:text-slate-100 block mb-2">{language === 'ta' ? activeDay.gospelRefTa : activeDay.gospelRefEn}</span>
                  <p className={`leading-relaxed font-serif whitespace-pre-wrap ${fontSizeClass}`}>{language === 'ta' ? activeDay.gospelTa : activeDay.gospelEn}</p>
                </div>
              </div>
            ))}
            {activeSubTab === 'prayers' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="flex flex-wrap gap-1 bg-slate-100/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/40 mb-2">
                  {[
                    { id: 'morning', labelEn: 'Morning', labelTa: 'காலை' },
                    { id: 'noon', labelEn: 'Noon', labelTa: 'நண்பகல்' },
                    { id: 'evening', labelEn: 'Evening', labelTa: 'மாலை' },
                    { id: 'night', labelEn: 'Night', labelTa: 'இரவு' },
                  ].map((hour) => (
                    <button key={hour.id} onClick={() => setSelectedPrayersHour(hour.id as PrayersHourType)}
                      className={`flex-1 py-1 rounded-lg text-[9.5px] font-bold transition truncate px-0.5 ${selectedPrayersHour === hour.id ? 'bg-indigo-950 dark:bg-amber-500 text-white dark:text-stone-950 shadow-2xs font-extrabold' : 'text-slate-600 dark:text-stone-400 hover:text-indigo-900 hover:bg-slate-200/50 dark:hover:bg-stone-850'}`}>
                      {language === 'ta' ? hour.labelTa : hour.labelEn}
                    </button>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-100/50 dark:border-amber-955/20 text-left relative shadow-2xs">
                  <div className="absolute top-0 inset-x-0 h-[2.5px] bg-amber-600/60 dark:bg-amber-500" />
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-amber-705 dark:text-amber-400 uppercase tracking-widest block mt-0.5">{language === 'ta' ? `${selectedPrayersHour.toUpperCase()} வழிபாடு` : `${selectedPrayersHour.toUpperCase()} PRAYER`}</span>
                    <h3 className="text-sm font-serif font-black text-indigo-955 dark:text-amber-50 leading-snug">{language === 'ta' ? activeHourPrayer.titleTa : activeHourPrayer.titleEn}</h3>
                  </div>
                  <div className="h-[1px] w-full bg-slate-100 dark:bg-stone-850 my-3" />
                  <p className={`whitespace-pre-wrap font-serif leading-relaxed text-slate-800 dark:text-amber-55/90 ${fontSizeClass}`}>{language === 'ta' ? activeHourPrayer.contentTa : activeHourPrayer.contentEn}</p>
                </div>
              </div>
            )}
            {activeSubTab === 'saint' && (
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-slate-150/60 dark:border-stone-850 shadow-2xs space-y-3.5 animate-in fade-in duration-200 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500/20 shrink-0 bg-slate-50 relative flex items-center justify-center text-amber-600">
                    {saintOfDay.imageUrl ? (
                      <img src={saintOfDay.imageUrl} alt={language === 'ta' ? saintOfDay.nameTa : saintOfDay.nameEn} referrerPolicy="no-referrer" loading="lazy" className="w-full h-full object-cover" />
                    ) : (<User size={24} />)}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-750 dark:text-amber-400 uppercase tracking-widest block mb-0.5">{language === 'ta' ? 'மறைசாட்சி / புனிதர் விழா' : 'FEAST OF THE CHRISTIAN SAINT'}</span>
                    <h3 className="text-sm font-serif font-black text-slate-905 dark:text-slate-100 leading-snug">{language === 'ta' ? saintOfDay.nameTa : saintOfDay.nameEn}</h3>
                    <span className="inline-block mt-1 text-[9.5px] font-bold text-amber-800 dark:text-amber-350 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 font-sans">{language === 'ta' ? 'திருவிழா நாள்:' : 'Feast Date:'} {saintOfDay.feastDate}</span>
                  </div>
                </div>
                <div className="h-[1px] w-full bg-slate-100 dark:bg-stone-850 my-2" />
                <div className="space-y-1.5 flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-wide block font-sans">{language === 'ta' ? 'புனிதரின் வரலாற்றுக்குறிப்பு' : 'Hagiography / Life Bio History'}</span>
                  <p className={`leading-relaxed text-slate-750 dark:text-slate-300 font-sans whitespace-pre-wrap ${fontSizeClass}`}>{language === 'ta' ? saintOfDay.lifeHistoryTa : saintOfDay.lifeHistoryEn}</p>
                </div>
              </div>
            )}
            {activeSubTab === 'office' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-100/50 dark:border-amber-955/20 text-left relative shadow-2xs">
                  <div className="absolute top-0 inset-x-0 h-[2.5px] bg-amber-600/60 dark:bg-amber-500" />
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">{language === 'ta' ? 'உள்நுழைவுப் பாடல்' : 'Invitatory'}</span>
                  <p className={`mt-2 leading-relaxed italic ${fontSizeClass}`}>{language === 'ta' ? 'ஆண்டவரே, என் இதழ்களைத் திறந்தருளும். என் வாய் உமது புகழை எடுத்தியம்பும்.' : 'Lord, open my lips. And my mouth shall declare your praise.'}</p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-1">{language === 'ta' ? 'திருப்பாடல் 95 - அழைப்புரை' : 'Psalm 95 - Invitatory Psalm'}</span>
                  <p className={`leading-relaxed ${fontSizeClass}`}>{language === 'ta' ? 'வாருங்கள், ஆண்டவரைப் புகழ்ந்து பாடுங்கள்; நமது மீட்பின் பாறையை நோக்கி அகமகிழ்ந்து ஆர்ப்பரியுங்கள்.' : 'Come, let us sing to the Lord and shout with joy to the Rock who saves us. Let us approach him with praise and thanksgiving, and sing joyful songs to the Lord.'}</p>
                </div>
                {activeDay.readingFirstEn && (
                  <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-0.5">{language === 'ta' ? 'முதல் வாசகம்' : 'First Reading'}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block mb-2">{language === 'ta' ? activeDay.readingFirstRefTa : activeDay.readingFirstRefEn}</span>
                    <p className={`leading-relaxed font-serif ${fontSizeClass}`}>{language === 'ta' ? activeDay.readingFirstTa : activeDay.readingFirstEn}</p>
                  </div>
                )}
                {activeDay.psalmEn && (
                  <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block mb-0.5">{language === 'ta' ? 'பதிலுரைத் திருப்பாடல்' : 'Responsorial Psalm'}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block mb-2">{language === 'ta' ? activeDay.psalmRefTa : activeDay.psalmRefEn}</span>
                    <p className={`leading-relaxed italic ${fontSizeClass}`}>{language === 'ta' ? activeDay.psalmTa : activeDay.psalmEn}</p>
                  </div>
                )}
                {activeDay.gospelEn && (
                  <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[9px] font-bold text-rose-700 dark:text-rose-450 uppercase tracking-widest block mb-0.5">{language === 'ta' ? 'புனித நற்செய்தி' : 'Holy Gospel'}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block mb-2">{language === 'ta' ? activeDay.gospelRefTa : activeDay.gospelRefEn}</span>
                    <p className={`leading-relaxed font-serif ${fontSizeClass}`}>{language === 'ta' ? activeDay.gospelTa : activeDay.gospelEn}</p>
                  </div>
                )}
                {activeDay.officeEn && (
                  <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/50 dark:border-amber-900/40 text-left relative shadow-2xs">
                    <div className="absolute top-0 inset-x-0 h-[2.5px] bg-[#b45309] dark:bg-amber-600/70" />
                    <span className="text-[9px] font-bold text-[#b45309] dark:text-amber-400 uppercase tracking-widest block">{language === 'ta' ? 'திருச்சபை தந்தையர் வாசகம்' : 'Patristic Reading'}</span>
                    <span className="text-[10px] uppercase font-bold text-indigo-950 dark:text-amber-200 mt-1 block mb-2">{language === 'ta' ? activeDay.officeRefTa : activeDay.officeRefEn}</span>
                    <p className={`leading-relaxed whitespace-pre-wrap ${fontSizeClass}`}>{language === 'ta' ? activeDay.officeTa : activeDay.officeEn}</p>
                  </div>
                )}
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/10 border border-amber-200/40 dark:border-amber-950/20">
                  <span className="text-[9px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest block mb-1">{language === 'ta' ? 'முடிவு மன்றாட்டு' : 'Concluding Prayer'}</span>
                  <p className={`italic leading-relaxed ${fontSizeClass}`}>{language === 'ta' ? 'ஆண்டவரே, உமது வார்த்தைகளை நாங்கள் ஆழமாகப் புரிந்து வாசிக்கவும், வாசிப்பதனை உண்மையாகக் கடைப்பிடிக்கவும் அருள் தாரும். எங்கள் ஆண்டவராகிய கிறிஸ்து வழியாக உம்மை மன்றாடுகிறோம். ஆமென்.' : 'Lord, grant us to read with understanding, and to keep what we read with fidelity. May Your truth guide our minds and Your love ignite our hearts. We ask this through Christ our Lord. Amen.'}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
