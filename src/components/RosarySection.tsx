import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, Compass, Heart, ArrowRight, BookOpen, RotateCw, CheckCircle } from 'lucide-react';

interface RosarySectionProps {
  language: 'en' | 'ta';
  fontSizeClass: string;
}

export const RosarySection: React.FC<RosarySectionProps> = ({ language, fontSizeClass }) => {
  const [activeSubTab, setActiveSubTab] = useState<'how' | 'mysteries' | 'interactive'>('how');
  
  // Mystery Category state for the manual listing
  const [selectedMysteryCat, setSelectedMysteryCat] = useState<'joyful' | 'sorrowful' | 'glorious' | 'luminous'>('joyful');

  // Interactive Beads Companion state
  const [currentStep, setCurrentStep] = useState(0); // index in interactive sequence
  const [beadProgress, setBeadProgress] = useState<number>(0); // specifically 0-10 for the active decade Hail Mary count
  const [activeMysteryDecade, setActiveMysteryDecade] = useState(1); // 1-5 decades

  // Automatically suggest the mystery of the day on mount
  useEffect(() => {
    const day = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
    if (day === 1 || day === 6) { // Monday, Saturday
      setSelectedMysteryCat('joyful');
    } else if (day === 2 || day === 5) { // Tuesday, Friday
      setSelectedMysteryCat('sorrowful');
    } else if (day === 3 || day === 0) { // Wednesday, Sunday
      setSelectedMysteryCat('glorious');
    } else if (day === 4) { // Thursday
      setSelectedMysteryCat('luminous');
    }
  }, []);

  const getMysteryDayString = (cat: 'joyful' | 'sorrowful' | 'glorious' | 'luminous') => {
    switch(cat) {
      case 'joyful': return language === 'ta' ? 'திங்கள் & சனிக்கிழமைகளில் செபிக்கப்படுகிறது' : 'Prayed on Mondays and Saturdays';
      case 'sorrowful': return language === 'ta' ? 'செவ்வாய் & வெள்ளிக்கிழமைகளில் செபிக்கப்படுகிறது' : 'Prayed on Tuesdays and Fridays';
      case 'glorious': return language === 'ta' ? 'புதன் & ஞாயிற்றுக்கிழமைகளில் செபிக்கப்படுகிறது' : 'Prayed on Wednesdays and Sundays';
      case 'luminous': return language === 'ta' ? 'வியாழக்கிழமைகளில் செபிக்கப்படுகிறது' : 'Prayed on Thursdays';
    }
  };

  const prayersList = {
    signOfCross: {
      titleEn: "Sign of the Cross",
      titleTa: "சிலுவை அடையாளம்",
      contentEn: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
      contentTa: "தந்தை, மகன், தூய ஆவியாரின் பெயராலே. ஆமென்."
    },
    creed: {
      titleEn: "Apostles' Creed",
      titleTa: "விசுவாசப் பிரமாணம்",
      contentEn: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead.\n\nI believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
      contentTa: "விண்ணகத்தையும் மண்ணகத்தையும் படைத்த எல்லாம் வல்ல தந்தையாகிய கடவுளை நம்புகிறேன். அவருடைய ஒரே மகனாகிய நம் ஆண்டவர் இயேசு கிறிஸ்துவையும் நம்புகிறேன். இவர் தூய ஆவியாரால் கருவாகி கன்னி மரியாளிடமிருந்து பிறந்தார். பொந்தியு பிலாத்தின் அதிகாரத்தில் பாடுபட்டு, சிலுவையில் அறையப்பட்டு, இறந்து அடக்கம் செய்யப்பட்டார். பாதாளத்தில் இறங்கி, மூன்றாம் நாள் இறந்தோரிடமிருந்து உயிர்த்தெழுந்தார். விண்ணகத்திற்கு ஏறி, எல்லாம் வல்ல தந்தையாகிய கடவுளின் வலப்பக்கத்தில் வீற்றிருக்கிறார். அங்கிருந்து வாழ்வோருக்கும் இறந்தோருக்கும் தீர்ப்பு வழங்க மீண்டும் வருவார்.\n\nதூய ஆவியாரை நம்புகிறேன். புனித கத்தோலிக்க திருச்சபையை நம்புகிறேன். புனிதர்களின் உறவுமுறையை நம்புகிறேன். பாவ மன்னிப்பை நம்புகிறேன். உடலின் உயிர்ப்பை நம்புகிறேன். நிலைவாழ்வை நம்புகிறேன். ஆமென்."
    },
    ourFather: {
      titleEn: "Our Father (The Lord's Prayer)",
      titleTa: "பரலோகத்தில் இருக்கிற எங்கள் பிதாவே",
      contentEn: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
      contentTa: "விண்ணுலகில் இருக்கிற எங்கள் தந்தையே, உமது பெயர் தூயது எனப் போற்றப்பெறுக! உமது ஆட்சி வருக! உமது திருவுளம் விண்ணுலகில் நிறைவேறுவது போல மண்ணுலகிலும் நிறைவேறுக! எங்கள் அன்றாட உணவை இன்று எங்களுக்குத் தாரும். எங்களுக்கு எதிராகக் குற்றம் செய்வோரை நாங்கள் மன்னிப்பது போல, எங்கள் குற்றங்களை மன்னியும். எங்களைச் சோதனைக்கு உட்படுத்தாதேயும், தீயோனிடமிருந்து எங்களை விடுவித்தருளும். ஆமென்."
    },
    hailMary: {
      titleEn: "Hail Mary",
      titleTa: "அருள்மிகப் பெற்ற மரியே வாழ்க",
      contentEn: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
      contentTa: "அருள் நிறைந்த மரியே வாழ்க! ஆண்டவர் உம்மோடு இருக்கிறார். பெண்களுள் ஆசீர்வதிக்கப்பட்டவர் நீரே, உமது திருவயிற்றின் கனியாகிய இயேசுவும் ஆசீர்வதிக்கப்பட்டவரே. புனித மரியே, இறைவனின் தாயே, பாவிகளாய் இருக்கிற எங்களுக்காக இப்போது இறப்பின் வேளையிலும் வேண்டிக்கொள்ளும். ஆமென்."
    },
    gloryBe: {
      titleEn: "Glory Be",
      titleTa: "பிதாவுக்கும் சுதனுக்கும்...",
      contentEn: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
      contentTa: "தந்தைக்கும் மகனுக்கும் தூய ஆவியாருக்கும் மாட்சிமை உண்டாவதாக. தொடக்கத்தில் இருந்தது போல இப்பொழுதும் எப்பொழுதும் என்றென்றும் இருப்பதாக. ஆமென்."
    },
    fatima: {
      titleEn: "Fatima Prayer",
      titleTa: "ஓ என் இயேசுவே...",
      contentEn: "O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to heaven, especially those in most need of Thy mercy. Amen.",
      contentTa: "ஓ என் இயேசுவே! எங்கள் பாவங்களை மன்னியும். எங்களை நரக நெருப்பிலிருந்து மீட்டருளும். எல்லா ஆன்மாக்களையும், சிறப்பாக உமது இரக்கம் யாருக்கு அதிகம் தேவையோ அவர்களை விண்ணகப் பாதையில் வழிநடத்தியருளும். ஆமென்."
    },
    hailHolyQueen: {
      titleEn: "Hail, Holy Queen (Salve Regina)",
      titleTa: "அதிதூய இராக்கினியே வாழ்க",
      contentEn: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.\n\nPray for us, O Holy Mother of God, that we may be made worthy of the promises of Christ. Amen.",
      contentTa: "அதிதூய இராக்கினியே, இரக்கத்தின் தாயே வாழ்க! எமது வாழ்வே, எமது இனிமையே, எமது நம்பிக்கையே வாழ்க! பரதேசிகளாயிருக்கும் நாங்கள் ஏவையின் மக்கள், உம்மை நோக்கிக் கூக்குரலிடுகிறோம். கண்ணீர்க் கணவாயிலிருந்து உம்மை நோக்கி அழுது பெருமூச்சு விடுகிறோம்.\n\nஆதலால் எங்களுடைய மத்தியஸ்தரே, உமது இரக்கமுள்ள கண்களை எங்கள் மேல் திருப்பியருளும். எமது இந்த நாடுகடத்தலின் பின்னர் உமது திருவயிற்றின் ஆசீர்வதிக்கப்பட்ட கனியாகிய இயேசுவை எங்களுக்குக் காட்டியருளும். கருணையுள்ளவரே, அன்பு நிறைந்தவரே, இனிய கன்னி மரியாStateType! இறைவனின் தூய அன்னையே, கிறிஸ்துவின் வாக்குறுதிகளுக்கு நாங்கள் தகுதிபெறும்படி எங்களுக்காக வேண்டிக்கொள்ளும். ஆமென்."
    }
  };

  const mysteriesData = {
    joyful: {
      titleEn: "The Joyful Mysteries (மகிழ்ச்சி நிறை)",
      titleTa: "மகிழ்ச்சி நிறை மறைபொருள்கள்",
      items: [
        {
          num: 1,
          nameEn: "The Annunciation",
          nameTa: "மங்கள வார்த்தை",
          descEn: "The Angel Gabriel announces to Mary that she will conceive the Son of God.",
          descTa: "அதிதூதர் கபிரியேல் கன்னி மரியாளுக்குத் தூது உரைத்தது (லூக்கா 1:26-38)."
        },
        {
          num: 2,
          nameEn: "The Visitation",
          nameTa: "மரியாள் எலிசபெத்தை சந்தித்தல்",
          descEn: "Mary visits her cousin Elizabeth, who is pregnant with John the Baptist.",
          descTa: "கன்னி மரியாள் எலிசபெத் அம்மாளைச் சந்தித்து வாழ்த்தியது (லூக்கா 1:39-56)."
        },
        {
          num: 3,
          nameEn: "The Nativity",
          nameTa: "இயேசுவின் பிறப்பு",
          descEn: "Jesus is born in a stable in Bethlehem.",
          descTa: "நம் ஆண்டவர் இயேசு கிறிஸ்து பெத்லகேமில் பிறந்தார் (லூக்கா 2:1-21)."
        },
        {
          num: 4,
          nameEn: "The Presentation",
          nameTa: "ஆலயத்தில் அர்ப்பணித்தல்",
          descEn: "Mary and Joseph present the infant Jesus in the Temple of Jerusalem.",
          descTa: "குழந்தை இயேசுவை எருசலேம் ஆலயத்தில் இறைவனுக்குக் காணிக்கையாக ஒப்புக்கொடுத்தார் (லூக்கா 2:22-38)."
        },
        {
          num: 5,
          nameEn: "The Finding in the Temple",
          nameTa: "காணாமல் போன இயேசுைக் கண்டடைதல்",
          descEn: "After seeking Him for three days, Mary and Joseph find the young Jesus in the Temple.",
          descTa: "காணாமல் போன பன்னிரண்டு வயது சிறுவன் இயேசுவை ஆலயத்தில் கண்டுபிடித்தல் (லூக்கா 2:41-52)."
        }
      ]
    },
    sorrowful: {
      titleEn: "The Sorrowful Mysteries (துயர்நிறை)",
      titleTa: "துயர்நிறை மறைபொருள்கள்",
      items: [
        {
          num: 1,
          nameEn: "The Agony in the Garden",
          nameTa: "கெத்சமனி தோட்டத்தில் வேதனை",
          descEn: "Jesus prays in intense agony in Gethsemane on the eve of His passion.",
          descTa: "இயேசு கெத்சமனி தோட்டத்தில் இரத்த வியர்வை சிந்தி வேதனைப்பட்டது (மத்தேயு 26:36-46)."
        },
        {
          num: 2,
          nameEn: "The Scourging at the Pillar",
          nameTa: "கசையடி பெறுதல்",
          descEn: "Jesus is bound and brutally flogged under Pontius Pilate.",
          descTa: "நம் ஆண்டவர் இயேசு கிறிஸ்து தூணில் கட்டப்பட்டு கசையடியால் நொறுக்கப்பட்டது (மத்தேயு 27:26)."
        },
        {
          num: 3,
          nameEn: "The Crowning with Thorns",
          nameTa: "முள்முடி சூட்டப்படுதல்",
          descEn: "A crown of sharp thorns is mockingly pressed into Jesus' head.",
          descTa: "இயேசுவின் தலையில் முள்முடி சூட்டி அவமானப்படுத்தியது (மத்தேயு 27:27-31)."
        },
        {
          num: 4,
          nameEn: "The Carrying of the Cross",
          nameTa: "சிலுவை சுமத்தல்",
          descEn: "Jesus carries His own wooden cross to the hill of Calvary.",
          descTa: "இயேசு உலகப் பாவங்களுக்காக சிலுவையைத் தோளில் சுமந்து சென்றது (யோவான் 19:17)."
        },
        {
          num: 5,
          nameEn: "The Crucifixion",
          nameTa: "சிலுவையில் அறையப்படுதல்",
          descEn: "Jesus is nailed to the cross and dies for the salvation of humanity.",
          descTa: "இயேசு சிலுவையில் அறையப்பட்டு, தன் உயிரைத் தியாகம் செய்தது (யோவான் 19:18-30)."
        }
      ]
    },
    glorious: {
      titleEn: "The Glorious Mysteries (மகிமை நிறை)",
      titleTa: "மகிமை நிறை மறைபொருள்கள்",
      items: [
        {
          num: 1,
          nameEn: "The Resurrection",
          nameTa: "இயேசுவின் உயிர்ப்பு",
          descEn: "Jesus rises gloriously from the dead on the third day.",
          descTa: "துன்பங்கள் கடந்து இயேசு கிறிஸ்து மூன்றாம் நாள் உயிர்த்தெழுந்தது (யோவான் 20:1-29)."
        },
        {
          num: 2,
          nameEn: "The Ascension",
          nameTa: "இயேசுின் விண்ணேற்றம்",
          descEn: "Jesus ascends bodily into Heaven in the presence of His disciples.",
          descTa: "நம் ஆண்டவர் இயேசு விண்ணகம் நோக்கி ஆரோகணமானது (அப்போஸ்தலர் 1:3-11)."
        },
        {
          num: 3,
          nameEn: "The Descent of the Holy Spirit",
          nameTa: "தூய ஆவியாரின் வருகை",
          descEn: "The Holy Spirit descends as tongues of fire upon Mary and the Apostles.",
          descTa: "அன்னை மரியாள் மீதும் அப்போஸ்தலர்கள் மீதும் தூய ஆவி பொழியப்பட்டது (அப்போஸ்தலர் 2:1-4)."
        },
        {
          num: 4,
          nameEn: "The Assumption of Mary",
          nameTa: "மரியாவின் விண்ணேற்பு",
          descEn: "At the end of her earthly life, Mary is taken body and soul into heaven.",
          descTa: "அன்னை கன்னி மரியாள் ஆன்மாவோடும் உடலோடும் விண்ணகத்திற்கு எடுத்துக்கொள்ளப்பட்டது."
        },
        {
          num: 5,
          nameEn: "The Coronation of Mary",
          nameTa: "மரியாவின் முடிசூட்டு விழா",
          descEn: "Mary is crowned by God the Father, Son, and Holy Spirit as Queen of Heaven.",
          descTa: "கன்னி மரியாள் விண்ணகத்திற்கும் மண்ணகத்திற்கும் இராக்கினியாக முடிசூட்டப்பட்டது."
        }
      ]
    },
    luminous: {
      titleEn: "The Luminous Mysteries (ஒளிநிறை)",
      titleTa: "ஒளிநிறை மறைபொருள்கள்",
      items: [
        {
          num: 1,
          nameEn: "The Baptism in the Jordan",
          nameTa: "யோர்தான் ஆற்றில் திருமுழுக்கு",
          descEn: "John baptizes Jesus in the River Jordan, as the Father declares 'This is my beloved Son'.",
          descTa: "இயேசு யோர்தான் ஆற்றில் தூய யோவானிடம் திருமுழுக்கு பெற்றது (மத்தேயு 3:13-17)."
        },
        {
          num: 2,
          nameEn: "The Wedding at Cana",
          nameTa: "கானா ஊர் திருமணம்",
          descEn: "Jesus performs His first sign by changing water into wine at Mary's request.",
          descTa: "கானா ஊர் கல்யாணத்தில் தண்ணீரைத் திராட்சை இரசமாக மாற்றியது (யோவான் 2:1-12)."
        },
        {
          num: 3,
          nameEn: "The Proclamation of the Kingdom",
          nameTa: "இறையாட்சியைப் பறைசாற்றுதல்",
          descEn: "Jesus proclaims the repentance and the coming of the Kingdom of God.",
          descTa: "இயேசு பாவமன்னிப்பை அறிவித்து இறையாட்சியைப் பறைசாற்றியது (மாற்கு 1:15)."
        },
        {
          num: 4,
          nameEn: "The Transfiguration",
          nameTa: "இயேசுின் உருமாற்றம்",
          descEn: "Jesus shines with divine light on Mount Tabor before Peter, James, and John.",
          descTa: "தாபோர் மலையில் இயேசு கிறிஸ்து உருமாறி மகிமை பெற்றது (மத்தேயு 17:1-8)."
        },
        {
          num: 5,
          nameEn: "The Institution of the Eucharist",
          nameTa: "நற்கருணை ஏற்படுத்துதல்",
          descEn: "Jesus shares His body and blood at the Last Supper, establishing the Holy Mass.",
          descTa: "இயேசு இறுதி இரா உணவின்போது நற்கருணையை ஏற்படுத்தியது (மத்தேயு 26:26-30)."
        }
      ]
    }
  };

  // Steps in the Interactive Rosary Companion
  const interactiveSteps = [
    { type: 'cross', labelEn: 'Sign of the Cross', labelTa: 'சிலுவை அடையாளம்', ref: 'signOfCross' },
    { type: 'creed', labelEn: "Apostles' Creed", labelTa: 'விசுவாசப் பிரமாணம்', ref: 'creed' },
    { type: 'ourFather_init', labelEn: 'Introductory Our Father', labelTa: 'தொடக்க பரலோக பிதாவே', ref: 'ourFather' },
    { type: 'hailMary_faith', labelEn: 'Hail Mary 1 (For Faith)', labelTa: 'அருள்மிகு பெற்ற மரியே 1 (விசுவாசம்)', ref: 'hailMary' },
    { type: 'hailMary_hope', labelEn: 'Hail Mary 2 (For Hope)', labelTa: 'அருள்மிகு பெற்ற மரியே 2 (நம்பிக்கை)', ref: 'hailMary' },
    { type: 'hailMary_love', labelEn: 'Hail Mary 3 (For Charity)', labelTa: 'அருள்மிகு பெற்ற மரியே 3 (அன்பு)', ref: 'hailMary' },
    { type: 'glory_init', labelEn: 'Introductory Glory Be & Fatima', labelTa: 'தொடக்க மகிமை & ஓ என் இயேசுவே', ref: 'gloryBe' },
    { type: 'mystery_announce', labelEn: 'Announce Mystery & Our Father', labelTa: 'மறைபொருளை அறிவித்து பரலோக பிதாவே', ref: 'ourFather' },
    { type: 'decade_beads', labelEn: 'Pray 10 Hail Marys', labelTa: '10 அருள்மிகு பெற்ற மரியே செபியுங்கள்', ref: 'hailMary' },
    { type: 'glory_decade', labelEn: 'Decade Glory Be & Fatima', labelTa: 'பத்து செப மகிமை & ஓ என் இயேசுவே', ref: 'gloryBe' },
    { type: 'hailHolyQueen', labelEn: 'Hail Holy Queen & Conclusion', labelTa: 'அதிதூய இராக்கினியே & முடிவு செபம்', ref: 'hailHolyQueen' }
  ];

  const handleNextInteractive = () => {
    const currentStepObj = interactiveSteps[currentStep];
    
    if (currentStepObj.type === 'decade_beads') {
      if (beadProgress < 9) {
        setBeadProgress(prev => prev + 1);
      } else {
        // Move to the next step (Glory Be of decade)
        setBeadProgress(0);
        setCurrentStep(prev => prev + 1);
      }
    } else if (currentStepObj.type === 'glory_decade') {
      if (activeMysteryDecade < 5) {
        // Prepare next decade mystery cycle!
        setActiveMysteryDecade(prev => prev + 1);
        // Reset back to mystery announce step to declare the next decade
        const nextMysteryStepIndex = interactiveSteps.findIndex(s => s.type === 'mystery_announce');
        setCurrentStep(nextMysteryStepIndex);
      } else {
         // All 5 decades completed, move to Hail Holy Queen final prayers
         setCurrentStep(prev => prev + 1);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const resetInteractive = () => {
    setCurrentStep(0);
    setBeadProgress(0);
    setActiveMysteryDecade(1);
  };

  const getInteractivePrayerText = () => {
    const stepObj = interactiveSteps[currentStep];
    if (!stepObj) return { title: '', content: '' };

    const refKey = stepObj.ref as keyof typeof prayersList;
    const item = prayersList[refKey];
    
    let title = language === 'ta' ? stepObj.labelTa : stepObj.labelEn;
    let content = language === 'ta' ? item.contentTa : item.contentEn;

    // Supplement details for the Decade Beads or Mystery Announce
    if (stepObj.type === 'mystery_announce') {
      const currentCat = mysteriesData[selectedMysteryCat];
      const selectedMystery = currentCat.items[activeMysteryDecade - 1];
      if (selectedMystery) {
        const mysteryTitle = language === 'ta' 
          ? `மறைபொருள் ${activeMysteryDecade}: ${selectedMystery.nameTa}`
          : `Mystery ${activeMysteryDecade}: ${selectedMystery.nameEn}`;
        const mysteryDesc = language === 'ta'
          ? selectedMystery.descTa
          : selectedMystery.descEn;

        title = `${mysteryTitle}`;
        content = `${language === 'ta' ? 'தியானிக்க வேண்டிய மறைபொருள்:' : 'Meditation description:'}\n"${mysteryDesc}"\n\n-----------------\n\n${language === 'ta' ? prayersList.ourFather.titleTa : prayersList.ourFather.titleEn}:\n${language === 'ta' ? prayersList.ourFather.contentTa : prayersList.ourFather.contentEn}`;
      }
    } else if (stepObj.type === 'decade_beads') {
      title = language === 'ta'
        ? `${activeMysteryDecade}-வது பத்து: மணி ${beadProgress + 1} / 10`
        : `Decade ${activeMysteryDecade}: Bead ${beadProgress + 1} of 10`;
    } else if (stepObj.type === 'glory_init') {
      title = language === 'ta' ? "மகிமை செபங்கள்" : "Glory Be & Fatima";
      content = `${language === 'ta' ? prayersList.gloryBe.titleTa : prayersList.gloryBe.titleEn}:\n${language === 'ta' ? prayersList.gloryBe.contentTa : prayersList.gloryBe.contentEn}\n\n-----------------\n\n${language === 'ta' ? prayersList.fatima.titleTa : prayersList.fatima.titleEn}:\n${language === 'ta' ? prayersList.fatima.contentTa : prayersList.fatima.contentEn}`;
    } else if (stepObj.type === 'glory_decade') {
       title = language === 'ta' ? `பத்து ${activeMysteryDecade} முடிவு மகிமை செபங்கள்` : `Decade ${activeMysteryDecade} Concluding Prayers`;
       content = `${language === 'ta' ? prayersList.gloryBe.titleTa : prayersList.gloryBe.titleEn}:\n${language === 'ta' ? prayersList.gloryBe.contentTa : prayersList.gloryBe.contentEn}\n\n-----------------\n\n${language === 'ta' ? prayersList.fatima.titleTa : prayersList.fatima.titleEn}:\n${language === 'ta' ? prayersList.fatima.contentTa : prayersList.fatima.contentEn}`;
    }

    return { title, content };
  };

  const activeMysteryColor = () => {
    switch (selectedMysteryCat) {
      case 'joyful': return 'border-emerald-100 dark:border-emerald-950/40 bg-emerald-50/20';
      case 'sorrowful': return 'border-red-100 dark:border-red-950/40 bg-red-50/10';
      case 'glorious': return 'border-yellow-100 dark:border-yellow-950/40 bg-yellow-50/20';
      case 'luminous': return 'border-blue-100 dark:border-blue-950/40 bg-blue-50/10';
    }
  };

  const activeMysteryTextClass = () => {
    switch (selectedMysteryCat) {
      case 'joyful': return 'text-emerald-700 dark:text-emerald-400';
      case 'sorrowful': return 'text-red-700 dark:text-red-400';
      case 'glorious': return 'text-yellow-750 dark:text-amber-400';
      case 'luminous': return 'text-[#2563eb] dark:text-[#60a5fa]';
    }
  };

  const activeMysteryBadgeClass = () => {
    switch (selectedMysteryCat) {
      case 'joyful': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 'sorrowful': return 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300';
      case 'glorious': return 'bg-yellow-105 text-yellow-900 dark:bg-yellow-950/40 dark:text-amber-305';
      case 'luminous': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-4 flex-1 flex flex-col text-left">
      
      {/* Tab Switcher */}
      <div className="flex bg-[#eae3d5] dark:bg-[#251e19] p-1.5 rounded-xl border border-amber-200/30 dark:border-amber-950/20 shrink-0">
        <button
          onClick={() => setActiveSubTab('how')}
          id="rosary-tab-how"
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
            activeSubTab === 'how'
              ? 'bg-indigo-950 dark:bg-amber-500 text-white dark:text-stone-950 shadow-xs'
              : 'text-slate-600 dark:text-stone-400 hover:text-indigo-950 dark:hover:text-amber-200'
          }`}
        >
          {language === 'ta' ? 'செபிப்பது எப்படி?' : 'Recitation Guide'}
        </button>
        <button
          onClick={() => setActiveSubTab('mysteries')}
          id="rosary-tab-mysteries"
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
            activeSubTab === 'mysteries'
              ? 'bg-indigo-950 dark:bg-amber-500 text-white dark:text-stone-950 shadow-xs'
              : 'text-slate-600 dark:text-stone-400 hover:text-indigo-950 dark:hover:text-amber-200'
          }`}
        >
          {language === 'ta' ? 'மறைபொருள்கள்' : 'The Mysteries'}
        </button>
        <button
          onClick={() => {
            setActiveSubTab('interactive');
            resetInteractive();
          }}
          id="rosary-tab-interactive"
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeSubTab === 'interactive'
              ? 'bg-indigo-950 dark:bg-amber-500 text-white dark:text-stone-950 shadow-xs'
              : 'text-slate-600 dark:text-stone-400 hover:text-indigo-950 dark:hover:text-amber-200'
          }`}
        >
          <Sparkles size={11} className={activeSubTab === 'interactive' ? 'text-amber-300 dark:text-stone-950' : 'text-amber-600'} />
          <span>{language === 'ta' ? 'செபியுங்கள்' : 'Live beads'}</span>
        </button>
      </div>

      {/* SUB-VIEW: 1. HOW TO RECITE */}
      {activeSubTab === 'how' && (
        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/25">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <HelpCircle size={15} />
              <span>{language === 'ta' ? 'ஜெபமாலை செபிப்பது எப்படி?' : 'How to pray the Holy Rosary?'}</span>
            </h4>
            <p className="text-[11px] text-amber-800 dark:text-amber-400/85 mt-2 leading-relaxed">
              {language === 'ta'
                ? 'அன்னை மரியாள் புனித தொமினிக்கிற்கு அருளிய தெய்வீக ஜெபமாலை, விசுவாசப் பாடங்களையும் நம் மீட்பராகிய இயேசுவின் வாழ்வின் முக்கிய மறைபொருள்களையும் தியானிக்க உதவும் உயரிய பக்தி முயற்சியாகும்.'
                : 'The Holy Rosary is a scripturally-based prayer companion. By reciting the prayers and meditating upon the key biological passages of our Savior Jesus Christ, we draw closer to Him through Mary.'}
            </p>
          </div>

          <div className="space-y-3.5 text-left">
            {[
              {
                step: 1,
                titleEn: "Begin with faith",
                titleTa: "விசுவாசத்துடன் தொடக்கம்",
                textEn: "Make the Sign of the Cross and recite the Apostles' Creed on the Crucifix.",
                textTa: "சிலுவை அடையாளத்தைச் செய்து, விசுவாசப் பிரமாணத்தை (விண்ணகத்தையும் மண்ணகத்தையும்) முழு மனதுடன் அறிக்கையிடுக."
              },
              {
                step: 2,
                titleEn: "The Lord's Prayer",
                titleTa: "கர்த்தர் கற்பித்த செபம்",
                textEn: "On the first large bead, recite the 'Our Father'.",
                textTa: "முதல் பெரிய மணி மீது 'பரலோகத்தில் இருக்கிற எங்கள் பிதாவே...' செபத்தைச் சொல்லுக."
              },
              {
                step: 3,
                titleEn: "Three Hail Marys",
                titleTa: "மூன்று அருள்மிகப் பெற்ற மரியே",
                textEn: "On the next three small beads, pray 'Hail Mary' for the virtues of Faith, Hope, and Charity, followed by a 'Glory Be'.",
                textTa: "அடுத்த மூன்று சிறிய மணிகள் மீது விசுவாசம், நம்பிக்கை, அன்பு ஆகிய புண்ணியங்கள் வளர மூன்று 'அருள் நிறைந்த மரியே வாழ்க வாழ்க...' செபங்களைச் சொல்லி, முடிவில் 'பிதாவுக்கும் சுதனுக்கும்...' செபத்தைச் சொல்லுக."
              },
              {
                step: 4,
                titleEn: "Announce Decades & Fruits",
                titleTa: "மறைபொருள்களைத் தியானித்தல்",
                textEn: "For each of the five decades, announce the Mystery (e.g. Joyful, Sorrowful), recite one 'Our Father' on the large bead, and ten 'Hail Marys' on the small beads while meditating.",
                textTa: "ஒவ்வொரு பத்து மணிகளைத் தொடங்கும் முன்பும் உரிய மறைபொருளை அறிவித்து, ஒரு 'பரலோக பிதாவே', பத்து 'அருள் நிறைந்த மரியே' செபித்து, முடிவில் ஒரு 'மகிமை' மற்றும் 'ஓ என் இயேசுவே' செபத்தைச் சொல்ல வேண்டும்."
              },
              {
                step: 5,
                titleEn: "Salutation and Litany",
                titleTa: "வாழ்க இராக்கினியே & முடிவு",
                textEn: "After five decades are completed, pray the 'Hail, Holy Queen' (Salve Regina) followed by the concluding Rosary prayer.",
                textTa: "ஐந்து பத்துகள் முடிந்தவுடன், 'அதிதூய இராக்கினியே வாழ்க, இரக்கத்தின் தாயே...' செபத்தை உரைத்து, இறுதி மன்றாட்டோடு நிறைவு செய்யுக."
              }
            ].map((s) => (
              <div key={s.step} className="p-3.5 rounded-xl border border-slate-100 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-sm flex gap-3 text-xs leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <h5 className="font-bold text-indigo-950 dark:text-amber-200">
                    {language === 'ta' ? s.titleTa : s.titleEn}
                  </h5>
                  <p className="text-slate-500 dark:text-stone-400 mt-1 font-sans text-[11px]">
                    {language === 'ta' ? s.textTa : s.textEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW: 2. MYSTERIES DIRECTORY */}
      {activeSubTab === 'mysteries' && (
        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-1">
          {/* Suggester badge */}
          <div className="bg-[#fcf9f2] dark:bg-stone-900 p-3 rounded-xl border border-amber-100/40 dark:border-stone-850 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-500">Today's Liturgical Practice Suggestion:</span>
            <span className="font-bold text-amber-800 dark:text-amber-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
          </div>

          {/* Mystery Class switcher */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 dark:bg-stone-950 rounded-xl border border-slate-200/50 dark:border-stone-850 shrink-0">
            {[
              { id: 'joyful', labelEn: 'Joyful', labelTa: 'மகிழ்ச்சி' },
              { id: 'sorrowful', labelEn: 'Sorrow', labelTa: 'துயர்' },
              { id: 'glorious', labelEn: 'Glorious', labelTa: 'மகிமை' },
              { id: 'luminous', labelEn: 'Luminous', labelTa: 'ஒளி' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedMysteryCat(cat.id as any)}
                className={`py-1.5 rounded-lg text-[10px] font-bold text-center transition-all ${
                  selectedMysteryCat === cat.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-stone-400 hover:text-indigo-950 dark:hover:text-amber-300'
                }`}
              >
                {language === 'ta' ? cat.labelTa : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Selected mystery metadata summary card */}
          <div className={`p-4 rounded-2xl border text-left ${activeMysteryColor()}`}>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${activeMysteryBadgeClass()}`}>
              {selectedMysteryCat} Mysteries
            </span>
            <h4 className={`text-md font-serif font-bold mt-2.5 ${activeMysteryTextClass()}`}>
              {mysteriesData[selectedMysteryCat].titleTa} ({mysteriesData[selectedMysteryCat].titleEn})
            </h4>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 flex items-center gap-1">
              <Compass size={11} />
              <span>{getMysteryDayString(selectedMysteryCat)}</span>
            </p>
          </div>

          {/* Five Mysteries item elements */}
          <div className="space-y-3">
            {mysteriesData[selectedMysteryCat].items.map((m) => (
              <div key={m.num} className="p-3 rounded-xl border border-slate-100 dark:border-stone-850 bg-white dark:bg-[#191410] shadow-2xs flex gap-3 text-xs text-left leading-relaxed">
                <span className="text-amber-650 font-serif font-extrabold text-[15px] pt-0.5 shrink-0 opacity-80">
                  {m.num}.
                </span>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-indigo-950 dark:text-amber-100 flex items-center gap-1">
                    <span>{language === 'ta' ? m.nameTa : m.nameEn}</span>
                    <span className="text-[9.5px] font-normal text-slate-400 italic">({language === 'ta' ? m.nameEn : m.nameTa})</span>
                  </h5>
                  <p className="text-slate-500 dark:text-stone-400 font-sans text-[11px]">
                    {language === 'ta' ? m.descTa : m.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW: 3. LIVE INTERACTIVE BEAD TRACKER */}
      {activeSubTab === 'interactive' && (
        <div className="space-y-4 flex-1 flex flex-col justify-between text-left">
          
          {currentStep < interactiveSteps.length ? (
            <>
              {/* Active decade summary indicators */}
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 tracking-wider uppercase border-b border-amber-250/20 pb-2 shrink-0">
                <span>Decade Category: <strong className="text-amber-700 dark:text-amber-400">{selectedMysteryCat}</strong></span>
                {interactiveSteps[currentStep].type === 'decade_beads' && (
                  <span className="text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
                    Decade {activeMysteryDecade} of 5
                  </span>
                )}
              </div>

              {/* Rosary Interactive Screen Cards */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#191410] border border-amber-150 dark:border-stone-850 flex-1 flex flex-col justify-between gap-5 shadow-xs overflow-y-auto max-h-[420px] relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-amber-600/60" />
                
                <div className="space-y-3.5">
                  <h4 className="text-sm font-bold text-indigo-950 dark:text-amber-200 uppercase tracking-wide leading-none font-serif text-amber-750 dark:text-amber-400 border-l-2 border-amber-500 pl-2">
                    {getInteractivePrayerText().title}
                  </h4>
                  <p className={`whitespace-pre-wrap italic ${fontSizeClass}`}>
                    {getInteractivePrayerText().content}
                  </p>
                </div>

                {/* Bead counting graphical visual bar */}
                {interactiveSteps[currentStep].type === 'decade_beads' && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-stone-850">
                    <span className="text-[10px] font-bold text-slate-400 block mb-2">PATER & DECA MINDER BEADS:</span>
                    <div className="flex justify-between items-center gap-1.5">
                      {Array.from({ length: 10 }).map((_, index) => {
                        const isDone = index < beadProgress;
                        const isCurrent = index === beadProgress;
                        return (
                          <div 
                            key={index}
                            className={`flex-1 h-3 rounded-full transition-all duration-300 relative ${
                              isDone 
                                ? 'bg-amber-600 dark:bg-amber-500 scale-100 opacity-90' 
                                : isCurrent 
                                ? 'bg-indigo-950 dark:bg-white scale-110 shadow-sm border-2 border-amber-500 ring-2 ring-amber-500/10' 
                                : 'bg-slate-200 dark:bg-stone-800'
                            }`}
                            title={`Bead ${index + 1}`}
                          >
                            {isCurrent && (
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-indigo-900 dark:text-amber-300">
                                {index + 1}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action controller footer buttons */}
              <div className="space-y-2 mt-2 shrink-0">
                <button
                  onClick={handleNextInteractive}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md transition-all active:scale-[0.98]"
                >
                  <span>
                    {interactiveSteps[currentStep].type === 'decade_beads' && beadProgress < 9
                      ? (language === 'ta' ? 'அடுத்த மணி செபிக்க' : 'Recite Next Hail Mary')
                      : (language === 'ta' ? 'அடுத்த செபத்திற்குச் செல்க' : 'Proceed to Next Prayer')
                    }
                  </span>
                  <ArrowRight size={13} className="ml-1" />
                </button>
                
                <button
                  onClick={resetInteractive}
                  className="w-full py-1.5 hover:bg-slate-100 dark:hover:bg-stone-850 text-slate-450 hover:text-indigo-950 dark:hover:text-amber-200 text-[10px] font-bold transition-all text-center rounded-lg flex items-center justify-center gap-1"
                >
                  <RotateCw size={11} />
                  <span>{language === 'ta' ? 'செபமாலையைத் தொடக்கத்திலிருந்து ஆரம்பி' : 'Reset & Start Over'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 px-6 text-center space-y-5 rounded-2xl bg-amber-50/20 dark:bg-amber-950/5 border border-amber-100/40 dark:border-amber-950/20 my-auto">
              <CheckCircle size={36} className="text-emerald-500 mx-auto" />
              <div className="space-y-1.5">
                <h4 className="text-base font-bold font-serif text-indigo-955 dark:text-amber-200">
                  {language === 'ta' ? 'ஜெபமாலை நிறைவுற்றது!' : 'Rosary Devotion Completed!'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-stone-450 leading-relaxed font-sans max-w-sm mx-auto">
                  {language === 'ta'
                    ? 'சுவர்க்கத்தின் இராக்கினியும் நமது அடைக்கலமுமாகிய மரியன்னைக்கு சமர்ப்பிக்கப்பட்ட முழு ஜெபமாலையையும் தியானித்து செபித்து முடித்துள்ளீர்கள். உமது வேண்டுதல் இறைசன்னிதியில் கேட்கப்படுவதாக!'
                    : 'You have faithfully meditated upon all five decades of the Rosary. May the peace of Christ and the motherly intercession of the Blessed Virgin Mary protect and guide you always.'}
                </p>
              </div>
              <button
                onClick={resetInteractive}
                className="px-6 py-2 bg-indigo-950 dark:bg-amber-500 text-white dark:text-stone-950 font-bold text-xs rounded-lg shadow-sm"
              >
                {language === 'ta' ? 'மீண்டும் செபிக்க' : 'Recite Again'}
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
