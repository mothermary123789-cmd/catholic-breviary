import { Prayer, Saint, LiturgicalDay, OfficeReading } from './types';

export const SEED_PRAYERS: Prayer[] = [
  {
    id: 'morning-prayer-01',
    date: '',
    category: 'morning',
    titleEn: 'Morning Prayer (Lauds) - Invitatory',
    titleTa: 'காலை வழிபாடு (புகழ்மாலை) - அழைப்புரை',
    contentEn: `Lord, open my lips.
And my mouth shall declare your praise.

Glory to the Father, and to the Son, and to the Holy Spirit.
As it was in the beginning, is now, and will be forever. Amen. Alleluia.

[Hymn: Morning Light]
The darkness is fading, the new day is born,
We lift up our voices to welcome the morn.
Grant us, O Father, to walk in Your light,
Protected and guided by grace in Your sight.

[Psalm 95 - Invitatory Psalm]
Come, let us sing to the Lord and shout with joy to the Rock who saves us.
Let us approach him with praise and thanksgiving, and sing joyful songs to the Lord.
The Lord is God, a great King above all gods.
In his hands are the depths of the earth; the heights of the mountains are his. He made the sea, it belongs to him, the dry land too, for it was formed by his hands.

Come, then, let us bow down and worship, bending the knee before the Lord, our maker.
For he is our God and we are his people, the flock he shepherds.

[Short Scripture Reading - Romans 13:11-13]
The night is far spent, the day is at hand. Let us therefore cast off the works of darkness, and let us put on the armor of light. Let us walk honestly, as in the day.

[Concluding Prayer & Blessing]
Lord, fill our hearts with your love as the dawn breaks. Let the sun of justice shine upon our lives. We ask this through our Lord Jesus Christ, your Son, who lives and reigns with you and the Holy Spirit, God, forever and ever. Amen.`,
    contentTa: `ஆண்டவரே, என் உதடுகளைத் திறந்தருளும்.
என் வாய் உமது புகழை எடுத்தியம்பும்.

தந்தைக்கும் மகனுக்கும் தூய ஆவியாருக்கும் ஆட்சிமை உண்டாகுக.
தொடக்கத்தில் இருந்ததுபோல இப்பொழுதும் எப்பொழுதும் என்றென்றும் இருப்பதாக. ஆமென். அல்லேலூயா.

[பாடல்: காலை ஒளி]
இருளெல்லாம் மறைந்தது, புது விடியல் பிறந்தது,
ஆண்டவரின் அருளைப் பாடக் குரல்கள் எழுந்தது.
விண்ணகத் தந்தையே, உமது ஒளியில் நடக்கவருளும்,
உமது பேரன்பால் எம்மைக் காத்து வழிநடத்தும்.

[திருப்பாடல் 95 - அழைப்புரை திருப்பாடல்]
வாருங்கள், ஆண்டவரைப் புகழ்ந்து பாடுங்கள்; நமது மீட்பின் பாறையை நோக்கி அகமகிழ்ந்து ஆர்ப்பரியுங்கள்.
நன்றியறிதலோடு அவர் திருமுன் செல்வோம்; திருப்பாடல்களால் அவரைப் புகழ்ந்து ஆர்ப்பரிப்போம்.
ஏனெனில், ஆண்டவரே மாபெரும் கடவுள்; எல்லாத் தெய்வங்களுக்கும் மேலான மாபெரும் அரசர்.
மண்ணுலகின் ஆழங்கள் அவர் கையில் உள்ளன; மலைகளின் சிகரங்களும் அவருக்கே சொந்தம்.
கடல் அவருடையதே, அதை அவரே படைத்தார்; உலர் நிலத்தையும் அவரது கையே உருவாக்கியது.

வாருங்கள், தலைவணங்கி அவரை வழிபடுவோம்; நம்மை உருவாக்கிய ஆண்டவர்முன் முழந்தாளிடுவோம்.
ஏனெனில், அவரே நம் கடவுள்; நாம் அவர் மேய்க்கும் மக்கள், அவர் வழிநடத்தும் ஆட்டுமந்தை.

[குறுகிய மறைநூல் வாசகம் - உரோமையர் 13:11-13]
இரவு முடியப்போகிறது; பகல் நெருங்கிவிட்டது. எனவே, இருளுக்குரிய செயல்களைக் களைந்துவிட்டு, ஒளியின் போர்க்கருவிகளை அணிந்துகொள்வோமாக. பகலில் நடப்பதுபோல கண்ணியமாக நடப்போமாக.

[நிறைவு மன்றாட்டு மற்றும் ஆசி]
ஆண்டவரே, விடியற்காலையில் உமது பேரன்பால் எங்களை நிரப்பியருளும். உமது நீதியின் கதிரவன் எங்களது வாழ்வில் என்றும் ஒளிரச் செய்தருளும். எங்கள் ஆண்டவராகிய இயேசு கிறிஸ்து வழியாக உம்மை மன்றாடுகிறோம். ஆமென்.`
  },
  {
    id: 'noon-prayer-001',
    date: '',
    category: 'noon',
    titleEn: 'Midday Prayer (Sext)',
    titleTa: 'நண்பகல் வழிபாடு (இருதயமாலை)',
    contentEn: `God, come to my assistance.
Lord, make haste to help me.

Glory to the Father, and to the Son, and to the Holy Spirit.
As it was in the beginning, is now, and will be forever. Amen. Alleluia.

[Hymn: Midday Peace]
Now at the turning of the sun,
The labor of the day is run.
Restore our bodies tired and worn,
With peace that from Your grace is born.

[Psalm 119 - Portion XIV]
Your word is a lamp to my feet and a light to my path.
I have sworn and confirmed that I will keep Your righteous judgments.
I am afflicted very much; revive me, O Lord, according to Your word.
Accept, I pray, the freewill offerings of my mouth, O Lord, and teach me Your judgments.

[Short Scripture Reading - Titus 2:11-12]
The grace of God has appeared, bringing salvation to all men, training us to renounce irreligion and worldly passions, and to live sober, upright, and godly lives in this world.

[Concluding Prayer]
Lord God, Savior of mankind, You made the midday hour a time of grace for us in the cross of Your Son. Fill our remaining hours with Your peace, that we may glorify You in all we do. We ask this through Christ our Lord. Amen.`,
    contentTa: `இறைவா, எனக்குத் துணைசெய்ய எழுந்தருளும்.
ஆண்டவரே, எனக்கு உதவி செய்ய விரைந்து வாரும்.

தந்தைக்கும் மகனுக்கும் தூய ஆவியாருக்கும் ஆட்சிமை உண்டாகுக.
தொடக்கத்தில் இருந்ததுபோல இப்பொழுதும் எப்பொழுதும் என்றென்றும் இருப்பதாக. ஆமென். அல்லேலூயா.

[பாடல்: நண்பகல் அமைதி]
கதிரவன் உச்சிக்கு வந்த இந்நேரம்,
நாளின் உழைப்பில் களைத்திருக்கும் நேரம்.
உடல் சோர்வுகள் யாவும் போக்கி,
உமது அருளால் எம்மைக் குளிரச்செய்யும்.

[திருப்பாடல் 119 - பகுதி XIV]
உமது வார்த்தையே என் காலடிக்கு விளக்கு; என் பாதைக்கு ஒளி.
உமது நீதியான தீர்ப்புகளைக் கடைப்பிடிப்பதாக நான் ஆணையிட்டு உறுதிமொழி தந்துள்ளேன்.
நான் பெரும் துன்பத்திற்கு ஆளானேன்; ஆண்டவரே, உமது வாக்குப்படி என்னை உயிர்ப்பித்தருளும்.
நான் மனமுவந்து செலுத்தும் புகழ்பலிகளை ஏற்றருளும்; உமது நீதிநெறிகளை எனக்குக் கற்றுத்தாரும்.

[குறுகிய மறைநூல் வாசகம் - தீத்து 2:11-12]
மனுமக்கள் அனைவருக்கும் மீட்பு அளிக்கும் கடவுளின் அருள் வெளிப்பட்டுள்ளது. அது நாம் இறைப்பற்றின்மையையும் உலக இச்சைகளையும் துறந்து, தாராள குணத்தோடும் நேர்மையோடும் இறையுணர்வோடும் இவ்வாழ்வில் வாழ நமக்குக் கற்றுக்கொடுக்கிறது.

[நிறைவு மன்றாட்டு]
மனிதகுலத்தை மீட்கும் இறைவா, உமது திருமகனின் சிலுவை மரணத்தின் வழியாக நண்பகல் வேளையை எங்களுக்கு அருள்நிறைந்ததாக மாற்றினீர். எஞ்சியிருக்கும் இந்நாளின் நேரங்களை உமது அமைதியால் நிரப்பும், இதனால் நாங்கள் செய்யும் யாவும் உம்மை மகிமைப்படுத்தட்டும். எங்கள் ஆண்டவராகிய இயேசு கிறிஸ்து வழியாக உம்மை மன்றாடுகிறோம். ஆமென்.`
  },
  {
    id: 'evening-prayer-1',
    date: '',
    category: 'evening',
    titleEn: 'Evening Prayer (Vespers)',
    titleTa: 'மாலை வழிபாடு (புகழ்மாலை)',
    contentEn: `God, come to my assistance.
Lord, make haste to help me.

Glory to the Father, and to the Son, and to the Holy Spirit.
As it was in the beginning, is now, and will be forever. Amen. Alleluia.

[Hymn: Evening Light]
O radiant Light, O Sun divine,
Upon our hearts in beauty shine.
As twilight falls and sun departs,
Keep alive Your fire within our hearts.

[Psalm 141 - Incense Prayer]
Let my prayer rise like incense before you, O Lord; the lifting up of my hands as an evening sacrifice.
I have called to you, Lord, hasten to help me! Hear my voice when I cry to you.
Set a guard, Lord, to watch over my mouth, keep a gate at the portal of my lips.

[The Magnificat - Canticle of Mary]
My soul proclaims the greatness of the Lord,
my spirit rejoices in God my Savior
for he has looked with favor on his lowly servant.
From this day all generations will call me blessed:
the Almighty has done great things for me, and holy is his Name.
He has mercy on those who fear him in every generation.
He has shown the strength of his arm, he has scattered the proud in their conceit.
He has cast down the mighty from their thrones, and has lifted up the lowly.
He has filled the hungry with good things, and the rich he has sent away empty.
He has come to the help of his servant Israel, for he has remembered his promise of mercy,
the promise he made to our fathers, to Abraham and his children for ever.

[Concluding Prayer]
Stay with us, Lord, for evening draws near and the day is spent. Guide us on our way to eternal safety. May Your love shield us through the dark of night. We ask this through Christ our Lord. Amen.`,
    contentTa: `இறைவா, எனக்குத் துணைசெய்ய எழுந்தருளும்.
ஆண்டவரே, எனக்கு உதவி செய்ய விரைந்து வாரும்.

தந்தைக்கும் மகனுக்கும் தூய ஆவியாருக்கும் ஆட்சிமை உண்டாகுக.
தொடக்கத்தில் இருந்ததுபோல இப்பொழுதும் எப்பொழுதும் என்றென்றும் இருப்பதாக. ஆமென். அல்லேலூயா.

[பாடல்: மாலை ஒளி]
மங்கிடும் மாலைப் பொழுதினில்,
எங்கள் இதயத்தின் பேரொளியே வாரும்.
ஞாயிறு மறைந்து இருள் சூழும் வேளையில்,
உமது அன்பின் சுடர் எமக்குள் எரியும்.

[திருப்பாடல் 141 - தூபக் காணிக்கை மன்றாட்டு]
என் மன்றாட்டு உமது திருமுன் தூபமென எழும்பட்டும்; என் கைகளை உயர்த்துவது மாலைப்பலியாக அமையட்டும்.
ஆண்டவரே, உம்மை நோக்கி மன்றாடுகிறேன், எனக்கு உதவ விரைந்து வாரும்; நான் கூப்பிடும்போது என் குரலுக்குச் செவிசாய்த்தருளும்.
ஆண்டவரே, என் வாய்க்கு ஒரு காவலாளியை வையும்; என் உதடுகளின் வாசலைக் பாதுகாத்தருளும்.

[மரியாவின் புகழ்ப்பாடல் - மாக்னிஃபிகாட்]
என் ஆன்மா ஆண்டவரைப் பெருமைப்படுத்துகின்றது; என் உள்ளம் எனது மீட்பராம் கடவுளை நினைத்துப் பேரின்பமடைகின்றது.
ஏனெனில் அவர் தம் தாழ்நிலை அடியாரைக் கண்ணோக்கினார்; இதோ! இதுமுதல் எல்லாத் தலைமுறையினரும் என்னை அருளப்பெற்றவர் என்பர்.
ஏனெனில் வல்லமையுடையவர் எனக்கு அரும்பெரும் செயல்கள் செய்துள்ளார்; தூயது என்பது அவரது பெயராகும்.
அவருக்கு அஞ்சி நடப்போருக்குத் தலைமுறை தலைமுறையாய் அவர் இரக்கம் காட்டி வருகிறார்.
அவர் தம் தோள்வலிமையைக் காட்டியுள்ளார்; உள்ளத்தில் செருக்குடன் சிந்திப்போரைச் சிதறடித்துள்ளார்.
வலியோரை அரியணையினின்று வீழ்த்தியுள்ளார்; தாழ்நிலையில் உள்ளோரை உயர்த்தியுள்ளார்.
பசித்தோரை நன்மைகளால் நிரப்பியுள்ளார்; செல்வர்களை வெறுங்கையராய் அனுப்பிவைத்துள்ளார்.
நம் மூதாதையருக்கு உரைத்தபடியே, ஆபிரகாமுக்கும் அவரது வழிமரபினருக்கும் என்றென்றும் இரக்கம் காட்ட மறந்துவிடவில்லை; தம் அடியாராகிய இஸ்ரயேலுக்குத் துணையாக நின்றார்.

[நிறைவு மன்றாட்டு]
ஆண்டவரே, எங்களோடு தங்கியிரும், ஏனெனில் மாலைப் பொழுது நெருங்கிவிட்டது; பகலும் முடிந்துவிட்டது. எங்களது ஆன்ம பயணத்தில் வழிகாட்டியாக இருந்தருளும். இரவின் இருளில் உமது பேரன்பு எங்களப் பாதுகாப்பதாக. எங்கள் ஆண்டவராகிய கிறிஸ்து வழியாக உம்மை மன்றாடுகிறோம். ஆமென்.`
  },
  {
    id: 'night-prayer-01',
    date: '',
    category: 'night',
    titleEn: 'Night Prayer (Compline)',
    titleTa: 'இரவு வழிபாடு (நிறைவுமாலை)',
    contentEn: `May the Lord all-powerful grant us a restful night and a peaceful death. Amen.

[Examination of Conscience] (A quiet moment is kept to reflect on our day)

[Hymn: Save us Lord]
Now that the daylight dies away,
By all Your grace we humbly pray,
To guide us through the hours of sleep,
And safe from every harm to keep.

[Psalm 91 - Assurance of Salvation]
He who dwells in the shelter of the Most High and abides in the shade of the Almighty says to the Lord: "My refuge, my stronghold, my God in whom I trust!"
Under his wings you will find refuge; his faithfulness is a shield and buckler.
You will not fear the hatred of the night nor the arrow that flies by day, nor the plague that prowls in the darkness nor the scourge that lays waste at noon.
For He will command his angels concerning you, to guard you in all your ways.

[Canticle of Simeon - Nunc Dimittis]
Protect us, Lord, as we stay awake; watch over us as we sleep, that awake we may keep watch with Christ, and asleep, rest in his peace.

Lord, now you let your servant go in peace; your word has been fulfilled.
My own eyes have seen the salvation which you have prepared in the sight of every people:
a light to reveal you to the nations and the glory of your people Israel.

Glory to the Father, and to the Son, and to the Holy Spirit.
As it was in the beginning, is now, and will be forever. Amen.`,
    contentTa: `எல்லாம் வல்ல ஆண்டவர் நமக்கு அமைதியான இரவையும் நல்மரணத்தையும் தந்தருளுவாராக. ஆமென்.

[மனச்சான்று ஆய்வு] (அமைதியான வேளையில் நமது நாளின் செயல்களை அசைபோடுதல்)

[பாடல்: எம்மைக் காத்தருளும்]
பகலின் ஒளி ஓய்ந்து போகும் வேளையில்,
உமது பேரருளால் உம்மை மன்றாடுகிறோம்.
தூங்கும் நேரங்களிலும் எங்களை வழிநடத்தும்,
தீங்குகள் யாவற்றிலிருந்தும் எங்களைக் காத்தருளும்.

[திருப்பாடல் 91 - ஆண்டவரின் பாதுகாப்பு]
உன்னதரின் மறைவில் வாழ்பவர், எல்லாம் வல்லவரின் நிழலில் தங்கியிருப்பவர் ஆண்டவரை நோக்கி: "நீரே என் புகலிடம்; என் அரண்; நான் நம்பியிருக்கும் என் கடவுள்" என்று கூறுவார்.
திருவிறகுகளின் கீழுள்ள புகலிடத்தை உமக்குத் தருவார்; அவரது உண்மையே உமக்குப் பரிசையும் கேடயமும் ஆகும்.
இரவின் அச்சுறுத்தலுக்கும் பகலில் பாய்ந்துவரும் அம்புக்கும் நீர் அஞ்சமாட்டீர். இருளில் நடமாடும் கொள்ளைநோய்க்கும் நண்பகலில் பாழாக்கும் வாதைக்கும் அஞ்சமாட்டீர்.
ஏனெனில், உமது பாதைகளில் எல்லாம் உம்மைக் காக்கும்படி, தம் தூதர்களுக்கு அவர் கட்டளையிடுவார்.

[சிமியோனின் புகழ்ப்பாடல்]
ஆண்டவரே, விழித்திருக்கும்போது எங்களைக் காத்தருளும்; தூங்கும்போது எங்களைக் காத்து வழிநடத்தும். அதனால் நாங்கள் கிறிஸ்துவோடு விழித்திருந்து, அமைதியில் துயில் கொள்ளுவோம்.

ஆண்டவரே, உமது வாக்குப்படி இப்போது உமது அடியாரை அமைதியுடன் போக விடுகிறீர்.
ஏனெனில், மக்கள் அனைவரும் காணும்படி நீர் தயாரித்த மீட்பை என் கண்கள் கண்டுகொண்டன.
இதுவே பிற இனத்தாருக்கு உமது ஒளியை வெளிப்படுத்தும் பேரொளி; உமது மக்களாகிய இஸ்ரயேலின் மாட்சி.

தந்தைக்கும் மகனுக்கும் தூய ஆவியாருக்கும் ஆட்சிமை உண்டாகுக.
தொடக்கத்தில் இருந்ததுபோல இப்பொழுதும் எப்பொழுதும் என்றென்றும் இருப்பதாக. ஆமென்.`
  },
  {
    id: 'office-readings-1',
    date: '',
    category: 'office',
    titleEn: 'Office of Readings (Matins)',
    titleTa: 'வாசகங்கள் வழிபாடு (நள்ளிரவுமாலை)',
    contentEn: `Lord, open my lips.
And my mouth shall declare your praise.

[Psalm 19 - The Praise of God's Law]
The heavens declare the glory of God; the firmament proclaims the work of his hands.
Day unto day pours forth speech; night unto night whispers the message.
No utterance, no words, no voice is heard; yet their span extends through all the earth, their words to the utmost bounds of the world.

[First Reading - Wisdom 1:1-7]
Love justice, you who rule the earth; think of the Lord in goodness, and seek him in integrity of heart.
Because he is found by those who do not test him, and manifests himself to those who do not unbelieve him.
For perverse counsels separate from God, and his power, which is put to the proof, rebukes the foolish.

[Second Reading (Patristic) - From the letters of Saint Cyprian, bishop]
How beloved and secure is the state of Christ's sheep, who are guided by the eternal Shepherd through green pastures! Let us open our ears to hear His holy decrees, and steady our feet to follow His steps without hesitation. Let our hearts burn with desire for the heavenly country, where tears are wiped away and joy is eternal.

[Concluding Prayer]
Lord, grant us to read with understanding, and to keep what we read with fidelity. May Your truth guide our minds and Your love ignite our hearts. We ask this through Christ our Lord. Amen.`,
    contentTa: `ஆண்டவரே, என் உதடுகளைத் திறந்தருளும்.
என் வாய் உமது புகழையே பாடும்.

[திருப்பாடல் 19 - இறைவனின் மாட்சி]
விண்ணுலகம் கடவுளின் மாட்சியை வெளிப்படுத்துகின்றது; ஆகாய விரிவு அவரது கைவேலைகளை அறிவிக்கின்றது.
ஒவ்வொரு நாளும் அடுத்த நாளுக்கு செய்தி உரைக்கின்றது; ஒவ்வொரு இரவும் அடுத்த இரவுக்கு அறிவை ஊட்டுகின்றது.
பேச்சும் இல்லை, வார்த்தையும் இல்லை, அவற்றின் குரல் கேட்கப்படுவதுமில்லை; ஆயினும் அவற்றின் ஒலி உலகெங்கும் பரவுகின்றது, அவற்றின் மொழிகள் நிலவுலகின் எல்லைகள்வரை சென்றடைகின்றன.

[முதல் வாசகம் - ஞானம் 1:1-7]
மண்ணுலகை ஆள்வோரே, நேர்மையை அன்புசெய்யுங்கள்; ஆண்டவரை நன்மனத்தோடு எண்ணிப்பாருங்கள்; நேர்மையான உள்ளத்தோடு அவரைத் தேடுங்கள்.
ஏனெனில், அவரைச் சோதிக்காதவர்களே அவரைக் கண்டடைகிறார்கள்; அவரை நம்ப மறுக்காதவர்களுக்கே அவர் தம்மை வெளிப்படுத்துகிறார்.
ஏனெனில், வழுவிய எண்ணங்கள் மனிதரை கடவுளிடமிருந்து பிரிக்கின்றன; அவர்தம் வல்லமை சோதிக்கப்படும்போது, அது அறிவிலிகளுக்கு அறிவு புகட்டுகிறது.

[இரண்டாம் வாசகம் (திருச்சபை தந்தை வாசகம்) - ஆயரும் மறைசாட்சியுமான தூய சிப்ரியான் எழுதிய கடிதத்திலிருந்து]
நம் நித்திய ஆயரால் பசுமையான புல்வெளிகளில் வழிநடத்தப்படும் கிறிஸ்துவின் ஆடுகளின் நிலை எவ்வளவு அன்பானதும் பாதுகாப்பானதுமாகும்! அவரது தூய கட்டளைகளைக் கேட்க நமது காதுகளைத் திறப்போம். எவ்வித தயக்கமும் இன்றி அவரது காலடிகளைப் பின்பற்ற நமது காலடிகளை நிலைநிறுத்துவோம். கண்ணீர் துடைக்கப்பட்டு, மகிழ்ச்சி என்றுமுள்ளதாக இருக்கும் விண்ணக நாட்டின் மீதான விருப்பத்தால் நம் இதயங்கள் எரியட்டும்.

[நிறைவு மன்றாட்டு]
ஆண்டவரே, உமது வார்த்தைகளை நாங்கள் ஆழமாகப் புரிந்து வாசிக்கவும், வாசிப்பதனை உண்மையாகக் கடைப்பிடிக்கவும் அருள் தாரும். உமது உண்மை எங்கள் மனதை வழிநடத்தட்டும், உமது அன்பு எங்கள் இதயங்களை எரியூட்டட்டும். எங்கள் ஆண்டவராகிய கிறிஸ்து வழியாக உம்மை மன்றாடுகிறோம். ஆமென்.`
  }
];

export const SEED_SAINTS: Saint[] = [
  {
    id: 'saint-romuald-abb',
    feastDate: '06-19',
    nameEn: 'St. Romuald, Abbot',
    nameTa: 'புனித ரொமுவால்டு, மடாதிபதி',
    lifeHistoryEn: `Saint Romuald (c. 951 – June 19, 1027) was the founder of the Camaldolese order. He spent his youth in worldly pleasures before witnessing his father kill a relative in a duel, which prompted him to enter a monastery.

Romuald sought extreme solitude and austerity, practicing intense contemplation. He founded Camaldoli in Tuscany, combining the monastic life of a community with the solitary life of hermits. He is a patron saint against cold and for contemplatives.`,
    lifeHistoryTa: `புனித ரொமுவால்டு (கி.பி. 951 - சூன் 19, 1027) கமல்டோலி துறவற சபையினைத் தோற்றுவித்தவர் ஆவார். அவரது இளமைக்காலம் ஆடம்பர உலக இன்பங்களில் கழிந்தது. பின்னர், அவர் தந்தை ஒரு சண்டையில் நெருங்கிய உறவினரைக் கொன்றதைக் கண்டு மனம் நொந்து, துறவற மடத்தில் சேர்ந்தார்.

அவர் தீவிர தனிமையையும், கடுமையான தவத்தையும் நாடினார். அவர் டஸ்கனி நகரில் கமல்டோலி துறவற இல்லத்தை நிறுவினார், அங்கு துறவிகளின் கூட்டு வாழ்வையும் தனிமைத் தவ வாழ்வையும் இணைத்தார். இவர் தியான வாழ்வை மேற்கொள்பவர்களின் பாதுகாவலர் ஆவார்.`,
    imageUrl: 'https://images.unsplash.com/photo-1548625361-155deee2614a?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'saint-aloysius-gon',
    feastDate: '06-21',
    nameEn: 'St. Aloysius Gonzaga, Religious',
    nameTa: 'புனித அலோசியஸ் கொன்சாகா, துறவி',
    lifeHistoryEn: `Saint Aloysius Gonzaga (March 9, 1568 – June 21, 1591) was an Italian aristocrat who became a member of the Society of Jesus (Jesuits). While still a student at the Roman College, he died as a result of caring for victims of an epidemic.

He was beatified in 1621 and canonized in 1726. He is the patron saint of Christian youth and students, known for his extraordinary purity and dedication to the sick.`,
    lifeHistoryTa: `புனித அலோசியஸ் கொன்சாகா (மார்ச்சு 9, 1568 - சூன் 21, 1591) என்பவர் இத்தாலிய பிரபு குடும்பத்தில் பிறந்து, பின்னர் இயேசு சபையில் (Jesuits) இணைந்த துறவி ஆவார். உரோமை கல்லூரியில் படித்துக் கொண்டிருக்கும்போது, அங்கு பரவிய கொள்ளைநோயால் பாதிக்கப்பட்ட மக்களுக்குப் பணிவிடை செய்ததால் நோய்தொற்றுக்கு ஆளாகி இறந்தார்.

இவர் 1621-இல் அருளாளராகவும், 1726-இல் புனிதராகவும் உயர்த்தப்பட்டார். இவர் கிறித்தவ இளைஞர்கள் மற்றும் மாணவர்களின் பாதுகாவலர் ஆவார். இவரது அசாதாரண தூய்மைக்காகவும் நோயாளிகள் மீதான அர்ப்பணிப்பிற்காகவும் போற்றப்படுகிறார்.`,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'saint-mother-mary',
    feastDate: '08-15',
    nameEn: 'The Assumption of the Blessed Virgin Mary',
    nameTa: 'புனித கன்னி மரியாவின் விண்ணேற்பு',
    lifeHistoryEn: `The Assumption of Mary into Heaven is the bodily taking up of the Virgin Mary into Heaven at the end of her earthly life.

This dogma was declared by Pope Pius XII in 1950. Mary is honored as the Mother of God, the ultimate intercessor, and Queen of Heaven and Earth. Her role in salvation history is celebrated by Christians worldwide.`,
    lifeHistoryTa: `புனித கன்னி மரியா தனது உலக வாழ்வின் முடிவில் உடலோடும் ஆன்மாவோடும் விண்ணகத்திற்கு எடுத்துக் கொள்ளப்பட்ட நிகழ்வே விண்ணேற்பு பெருவிழா ஆகும்.

இந்த கோட்பாடு 1950-இல் திருத்தந்தை பன்னிரண்டாம் பியுஸால் விசுவாசக் கோட்பாடாக அறிவிக்கப்பட்டது. மரியா இறைவனின் தாயாகவும், சிறந்த பரிந்துரையாளராகவும், விண்ணக மண்ணக அரசியாகவும் போற்றப்படுகிறார். மீட்பு வரலாற்றில் அவரது பங்கு உலகெங்கிலும் உள்ள கிறித்தவர்களால் கொண்டாடப்படுகிறது.`,
    imageUrl: 'https://images.unsplash.com/photo-1601314002592-b873038687ea?w=400&auto=format&fit=crop&q=60'
  }
];

export const SEED_LITURGICAL_CALENDAR: LiturgicalDay[] = [
  {
    date: '2026-06-19',
    seasonEn: 'Ordinary Time',
    seasonTa: 'சாதாரண காலம்',
    color: 'green',
    feastEn: 'Friday of the Eleventh Week in Ordinary Time',
    feastTa: 'சாதாரண காலத்தின் பதினோராவது வாரத்தின் வெள்ளிக்கிழமை',
    readingFirstRefEn: '2 Kings 11:1-4, 9-18, 20',
    readingFirstRefTa: '2 அரசர்கள் 11:1-4, 9-18, 20',
    readingFirstEn: `Athaliah the mother of Ahaziah saw that her son was dead, she arose and destroyed all the royal family. But Jehosheba, the daughter of king Joram, sister of Ahaziah, took Joash the son of Ahaziah, and stole him away from among the king's sons who were about to be slain, and she put him and his nurse in a bedchamber. Thus she hid him from Athaliah, so that he was not slain; and he remained with her six years, hid in the house of the Lord...`,
    readingFirstTa: `அகசியாவின் தாய் அத்தாலியா தன் மகன் இறந்துவிட்டதைக் கண்டபோது, அரச குலத்தார் அனைவரையும் அழிக்கத் தொடங்கினாள். ஆனால் யோராம் அரசனுடைய மகளும் அகசியாவின் சகோதரியுமான யோசேபா, கொலை செய்யப்படவிருந்த அரச குமாரர்களுக்கிடையிலிருந்து அகசியாவின் மகன் யோவாசைக் கடத்திக்கொண்டு போய், அவனையும் அவனது செவிலியையும் படுக்கையறை ஒன்றில் ஒளித்து வைத்தாள்...`,
    psalmRefEn: 'Psalm 132:11, 12, 13-14, 17-18',
    psalmRefTa: 'திருப்பாடல் 132:11, 12, 13-14, 17-18',
    psalmEn: `The Lord swore an oath to David, a promise he will not break: "A son of your own body I will set upon your throne. If your sons keep my covenant and my decrees that I shall teach them, their sons also, for evermore, shall sit upon your throne."`,
    psalmTa: `ஆண்டவர் தாவீதுக்கு உண்மையாய் ஆணையிட்டுக் கூறினார்; அவர் தம் வாக்கு மாறாதவர்: "உன் உடலின் கனியாகிய ஒருவனை உனது அரியணையில் அமர்த்துவேன். உன் மைந்தர் என் உடன்படிக்கையையும் நான் கற்பிக்கும் என் ஒழுங்குமுறைகளையும் கடைப்பிடித்தால், அவர்தம் பிள்ளைகளும் என்றென்றும் உன் அரியணையில் வீற்றிருப்பர்."`,
    gospelRefEn: 'Matthew 6:19-23',
    gospelRefTa: 'மத்தேயு 6:19-23',
    gospelEn: `Jesus said to his disciples: "Do not lay up for yourselves treasures on earth, where moth and rust consume and where thieves break in and steal, but lay up for yourselves treasures in heaven, where neither moth nor rust consumes and where thieves do not break in and steal. For where your treasure is, there will your heart be also. The eye is the lamp of the body. So, if your eye is sound, your whole body will be full of light."`,
    gospelTa: `இயேசு தம் சீடர்களை நோக்கிக் கூறியது: "மண்ணுலகில் உங்களுக்கெனச் செல்வத்தைச் சேமித்து வைக்க வேண்டாம். இங்கே பூச்சியும் துருவும் அவற்றை அழித்துவிடும்; திருடரும் கன்னமிட்டுத் திருடுவர். மாறாக, விண்ணுலகில் உங்களுக்காகச் செல்வத்தைச் சேமித்து வையுங்கள்; அங்கே பூச்சியும் துருவும் அவற்றை அழிப்பதில்லை; திருடரும் கன்னமிட்டுத் திருடுவதில்லை. உங்கள் செல்வம் எங்கு உள்ளதோ அங்கே உங்கள் உள்ளமும் இருக்கும்... உடலுக்கு விளக்கு கண் தான். கண் நலமாயிருந்தால் உங்கள் உடல் முழுவதும் ஒளியாய் இருக்கும்."`,
    officeRefEn: 'Hebrews 3:1-12',
    officeRefTa: 'எபிரேயர் 3:1-12',
    officeEn: `Therefore, holy brothers, you who share in a heavenly calling, consider Jesus, the apostle and high priest of our confession, who was faithful to him who appointed him, just as Moses also was faithful in all God's house. For Jesus has been counted worthy of more glory than Moses... Take care, brothers, lest there be in any of you an evil, unbelieving heart, leading you to fall away from the living God.`,
    officeTa: `ஆகவே, விண்ணக அழைப்பில் பங்குபெறும் தூய சகோதர சகோதரிகளே, நாம் அறிக்கையிடும் திருத்தூதரும் தலைமைக்குருவுமாகிய இயேசுவை உற்று நோக்குங்கள். மோசே கடவுளது இல்லம் முழுவதிலும் நம்பிக்கைக்குரியவராய் இருந்ததுபோல, இயேசுவும் தம்மை நியமித்தவருக்கு நம்பிக்கைக்குரியவராய் இருந்தார்... சகோதர சகோதரிகளே, உங்களுள் எவருடைய உள்ளமும் தீமை நிறைந்ததாகவும் நம்பிக்கையற்றதாகவும் இராமல் பார்த்துக் கொள்ளுங்கள். அத்தகைய உள்ளம் உங்களை வாழும் கடவுளிடமிருந்து விலக்கிக் கொண்டுபோகும்.`
  },
  {
    date: '2026-06-20',
    seasonEn: 'Ordinary Time',
    seasonTa: 'சாதாரண காலம்',
    color: 'green',
    feastEn: 'Memorial of the Immaculate Heart of the Blessed Virgin Mary',
    feastTa: 'புகழ்மிக்க தூய கன்னி மரியாவின் மாசற்ற இருதய நினைவு',
    readingFirstRefEn: 'Isaiah 61:9-11',
    readingFirstRefTa: 'எசாயா 61:9-11',
    readingFirstEn: `Their descendants shall be known among the nations, and their offspring in the midst of the peoples; all who see them shall acknowledge them, that they are a people whom the Lord has blessed. I will greatly rejoice in the Lord, my soul shall exult in my God; for he has clothed me with the garments of salvation, he has covered me with the robe of righteousness...`,
    readingFirstTa: `அவர்களுடைய இனம் பிற இனத்தாரிடையேயும், அவர்களுடைய சந்ததி மக்கள் கூட்டத்தின் நடுவிலும் புகழ் பெற்றிருக்கும்; அவர்களைப் பார்க்கிற யாவரும் ஆண்டவர் ஆசி வழங்கிய சந்ததி அவர்கள் என அறிந்துகொள்வர். ஆண்டவரில் யான் பெரிதும் மகிழ்வேன்; என் கடவுளில் என் ஆன்மா பூரிப்படையும்; ஏனெனில், மணமகன் தன் தலையில் மாலை அணிவதுபோலவும், மணமகள் நகைகளால் தன்னை அலங்கரிப்பதுபோலவும் அவர் மீட்பின் ஆடைகளை எனக்கு உடுத்தினார்...`,
    psalmRefEn: '1 Samuel 2:1, 4-5, 6-7, 8',
    psalmRefTa: '1 சாமுவேல் 2:1, 4-5, 6-7, 8',
    psalmEn: `My heart exults in the Lord; my strength is exalted in the Lord. My mouth derides my enemies, because I rejoice in your salvation. There is none holy like the Lord, there is none besides thee.`,
    psalmTa: `என் உள்ளம் ஆண்டவரில் களிகூர்கின்றது; என் கொம்பு ஆண்டவரில் உயர்த்தப்பட்டுள்ளது; என் வாய் என் எதிரிகளை எள்ளி நகையாடுகின்றது; ஏனெனில் உம் மீட்பில் நான் அகமகிழ்கின்றேன். ஆண்டவரைப்போல் தூயவர் எவருமிலர்.`,
    gospelRefEn: 'Luke 2:41-51',
    gospelRefTa: 'லூக்கா 2:41-51',
    gospelEn: `Now his parents went to Jerusalem every year at the feast of the Passover. And when he was twelve years old, they went up according to custom... After three days they found him in the temple, sitting among the teachers, listening to them and asking them questions... And his mother said to him, "Son, why have you treated us so? Behold, your father and I have been looking for you anxiously." And his mother kept all these things in her heart.`,
    gospelTa: `இயேசுவின் பெற்றோர் ஆண்டுதோறும் பாஸ்கா விழாவைக் கொண்டாட எருசலேமுக்குப்போவார்கள். அவருக்குப் பன்னிரண்டு வயது ஆனபோது, வழக்கப்படி விழாவைக் கொண்டாட எருசலேம் சென்றனர்... மூன்று நாட்களுக்குப் பின் அவர்கள் அவரைக் கோவிலில் கண்டார்கள். அங்கே அவர் போதகர்கள் நடுவில் அமர்ந்து அவர்கள் சொல்வதைக் கேட்டும் அவர்களிடம் வினாக்களைத் தொடுத்தும் கொண்டிருந்தார்... அவருடைய தாய் அவரை நோக்கி, "மகனே, ஏன் எங்களுக்கு இப்படிச் செய்தாய்? இதோ பார், உன் தந்தையும் நானும் உன்னைத் தேடி அலைந்தோமே" என்றார். அவருடைய தாய் இச்செய்திகளையெல்லாம் தன் உள்ளத்தில் பதித்து வைத்திருந்தார்.`
  },
  {
    date: '2026-06-21',
    seasonEn: 'Ordinary Time',
    seasonTa: 'சாதாரண காலம்',
    color: 'white',
    feastEn: 'St. Aloysius Gonzaga, Religious - Memorial',
    feastTa: 'புனித அலோசியஸ் கொன்சாகா, துறவி - நினைவு',
    readingFirstRefEn: '1 John 5:1-5',
    readingFirstRefTa: '1 யோவான் 5:1-5',
    readingFirstEn: `Everyone who believes that Jesus is the Christ is a child of God, and everyone who loves the parent loves the child. By this we know that we love the children of God, when we love God and obey his commandments. For this is the love of God, that we keep his commandments. And his commandments are not burdensome. For whatever is born of God overcomes the world; and this is the victory that overcomes the world, our faith.`,
    readingFirstTa: `இயேசு தான் கிறிஸ்து என்று நம்புவோர் அனைவரும் கடவுளிடமிருந்து பிறந்தவர்கள். பெற்றவரிடம் அன்பு செலுத்துவோர் அனைவரும் அவரிடமிருந்து பிறந்த பிள்ளைகளிடமும் அன்பு செலுத்துவர். நாம் கடவுளிடம் அன்புகொண்டு அவருடைய கட்டளைகளைக் கடைப்பிடிக்கும்போது, கடவுளின் பிள்ளைகளிடம் அன்பு செலுத்துகிறோம் என அறிந்துகொள்ளலாம். ஏனெனில் அவருடைய கட்டளைகளைக் கடைப்பிடிப்பதே கடவுளிடம் அன்பு செலுத்துவதாகும்; அவருடைய கட்டளைகள் சுமையானவை அல்ல. கடவுளிடமிருந்து பிறப்பவை யாவும் உலகை வெல்லும்...`,
    psalmRefEn: 'Psalm 16:1-2, 5, 7-8, 11',
    psalmRefTa: 'திருப்பாடல் 16:1-2, 5, 7-8, 11',
    psalmEn: `Preserve me, O God, for in thee I take refuge. I say to the Lord, "Thou art my Lord; I have no good besides thee." The Lord is my chosen portion and my cup; thou holdest my lot.`,
    psalmTa: `இறைவா, என்னைக் காத்தருளும்; நான் உம்மிடம் அடைக்கலம் புகுந்துள்ளேன். நான் ஆண்டவரிடம், "நீரே என் தலைவர்; உம்மைத் தவிர வேறு நலம் எனக்கு இல்லை" என்று கூறினேன். ஆண்டவரே என் பங்காகக் கிடைத்தவர்; என் கிண்ணமும் அவரே; எனக்குரிய பங்கை அவரே நிலைநிறுத்துகிறார்.`,
    gospelRefEn: 'Matthew 22:34-40',
    gospelRefTa: 'மத்தேயு 22:34-40',
    gospelEn: `But when the Pharisees heard that he had silenced the Sadducees, they came together. And one of them, a lawyer, asked him a question, to test him. "Teacher, which is the great commandment in the law?" And he said to him, "You shall love the Lord your God with all your heart, and with all your soul, and with all your mind. This is the great and first commandment. And a second is like it, You shall love your neighbor as yourself."`,
    gospelTa: `சதுசேயர்களை வாயடைக்கச் செய்தார் என்று கேள்வியுற்ற பரிசேயர் ஒன்றாகக் கூடிவந்தனர். அவர்களுள் சட்ட அறிஞர் ஒருவர் அவரைச் சோதிக்கும்படி ஒரு கேள்வி கேட்டார்: "போதகரே, திருச்சட்டத்திலேயே மிக முக்கியமான கட்டளை எது?" இயேசு அவரை நோக்கி: "'உன் முழு இதயத்தோடும், உன் முழு ஆன்மாவோடும், உன் முழு மனத்தோடும் உன் கடவுளாகிய ஆண்டவரிடம் அன்பு செலுத்துவாயாக.' இதுவே முதன்மையானதும் மிக முக்கியமானதுமான கட்டளை. இதற்கு இணையான இரண்டாவது கட்டளை: 'உன்மீது நீ அன்புகூர்வதுபோல உனக்கு அடுத்திருப்பவர்மீதும் அன்புகூர்வாயாக' என்பது."`
  },
  {
    date: '2026-06-22',
    seasonEn: 'Ordinary Time',
    seasonTa: 'சாதாரண காலம்',
    color: 'green',
    feastEn: 'Monday of the Twelfth Week in Ordinary Time',
    feastTa: 'சாதாரண காலத்தின் பன்னிரண்டாவது வாரத்தின் திங்கட்கிழமை',
    readingFirstRefEn: '2 Kings 17:5-8, 13-15a, 18',
    readingFirstRefTa: '2 அரசர்கள் 17:5-8, 13-15a, 18',
    readingFirstEn: `Then the king of Assyria invaded all the land and went up to Samaria, and for three years he besieged it. In the ninth year of Hoshea the king of Assyria captured Samaria, and he carried the Israelites away to Assyria... and this befell because the people of Israel had sinned against the Lord their God, who had brought them up out of the land of Egypt...`,
    readingFirstTa: `அசிரிய மன்னர் நாடு முழுவதையும் ஊடுருவி, சமாரியாவுக்குச் சென்று மூன்று ஆண்டுகள் முற்றுகையிட்டார். ஓசேயாவின் ஒன்பதாம் ஆட்சியாண்டில், அசிரிய மன்னர் சமாரியாவைக் கைப்பற்றி, இஸ்ரயேலரை அசிரியாவுக்குக் கடத்திச் சென்றார்... இஸ்ரயேலர்கள் தங்களை எகிப்து நாட்டிலிருந்து மீட்ட தங்கள் கடவுளாகிய ஆண்டவருக்கு எதிராகப் பாவம் செய்ததாலும், பிற தெய்வங்களை வழிபட்டதாலும் இவ்வாறு நேரிட்டது...`,
    psalmRefEn: 'Psalm 60:3, 4-5, 12-13',
    psalmRefTa: 'திருப்பாடல் 60:3, 4-5, 12-13',
    psalmEn: `O God, thou hast rejected us, broken our defenses; thou hast been angry; oh, restore us! Thou hast made the land to quake, thou hast rent it open; repair its breaches, for it shakes.`,
    psalmTa: `இறைவா, நீர் எங்களைப் புறக்கணித்து எங்களைத் துகளாக்கினீர். உமது சினம் தணியட்டும்; மீண்டும் எங்களை நிலைகொள்ளச் செய்யும்! நாட்டை நிலைகுலையச் செய்து பிளந்துபோகச் செய்தீர். அதன் பிளவுகளை அடைத்தருளும்; ஏனெனில் அது நடுங்குகின்றது.`,
    gospelRefEn: 'Matthew 7:1-5',
    gospelRefTa: 'மத்தேயு 7:1-5',
    gospelEn: `Jesus said to his disciples: "Judge not, that you be not judged. For with the judgment you pronounce you will be judged, and the measure you give will be the measure you get. Why do you see the speck that is in your brother's eye, but do not notice the log that is in your own eye?"`,
    gospelTa: `இயேசு தம் சீடர்களை நோக்கிக் கூறியது: "பிறரைத் தீர்க்கிடாதீர்கள்; அப்போதுதான் நீங்களும் தீர்ப்புக்கு ஆளாகமாட்டீர்கள். நீங்கள் அளிக்கும் தீர்ப்பின்படியே நீங்களும் தீர்ப்புப் பெறுவீர்கள்; நீங்கள் அளக்கும் அளவையாலேயே உங்களுக்கும் அளக்கப்படும். உங்கள் சகோதரர் கண்ணில் இருக்கும் துரும்பை நீங்கள் பார்ப்பதேன்? உங்கள் சொந்தக் கண்ணில் இருக்கும் மரக்கட்டையை கவனியாமல் இருப்பதேன்?"`
  }
];

export const SEED_OFFICE_READINGS: OfficeReading[] = [
  {
    id: 'office-patristic-001',
    refEn: 'From the Confessions of St. Augustine, Bishop & Doctor',
    refTa: 'புனித அகஸ்டின் எழுதிய "அறிக்கைகள்" நூலிலிருந்து',
    textEn: 'You have made us for yourself, O Lord, and our heart is restless until it rests in You. In adversity, let me seek Your light; in prosperity, let me sing Your praise. You are the ultimate truth, the source of all holiness, and the lover of our souls. Guide us as we walk through this pilgrim life on earth.',
    textTa: 'ஆண்டவரே, நீர் எங்களை உமக்காகவே படைத்தீர்; எங்கள் உள்ளம் உம்மில் ஓய்வுகொள்ளும் வரை அமைதியற்றிருக்கும். துன்ப நேரங்களில் உமது ஒளியைத் தேடவும், இன்ப நேரங்களில் உமக்குப் புகழ் பாடவும் எங்களுக்குக் கற்றுத்தாரும். நீரே இறுதி உண்மை, பரிசுத்தத்தின் ஊற்று, எங்கள் ஆன்மாவின் நேசர்.'
  },
  {
    id: 'office-patristic-002',
    refEn: 'From a pastoral letter by St. Francis de Sales, Bishop',
    refTa: 'புனித பிரான்சிஸ் டி சேல்ஸ் எழுதிய அருட்பணி கடிதத்திலிருந்து',
    textEn: 'Do not look forward in fear to the changes in this life; rather look to them with full hope that as they arise, God, whose very own you are, will deliver you out of them. He has kept you until now, and He will lead you safely through all things. Be at peace, and set aside all anxious thoughts.',
    textTa: 'இவ்வாழ்வில் ஏற்படும் மாற்றங்களை எண்ணி பயத்துடன் எதிர்நோக்க வேண்டாம்; மாறாக, கடவுள் உங்களைப் பாதுகாப்பார் என்ற முழு நம்பிக்கையோடு அவற்றை நோக்குங்கள். அவர் உங்களை இதுவரை பாதுகாத்தவர்; இனிமேலும் எல்லாவற்றிலும் பத்திரமாக வழிநடத்துவார். மனதை அமைதியாக வைத்துக்கொள்ளுங்கள், வீண் கவலைகளைக் களைந்துவிடுங்கள்.'
  },
  {
    id: 'office-patristic-003',
    refEn: 'From a homily by St. John Chrysostom, Archbishop of Constantinople',
    refTa: 'புனித யோவான் கிறிசோஸ்தோம் எழுதிய மறைப்பொழிவிலிருந்து',
    textEn: 'Charity is the root of all good things. It is the bond of perfect unity. It is the Queen of virtues. The more we love, the more we become like God. Let us not grow weary in doing good, for in due season we shall reap a harvest of eternal joy if we do not give up.',
    textTa: 'அன்பே அனைத்து நன்மைகளுக்கும் வேராகும். அதுவே பூரண ஒற்றுமையின் கட்டாகும். அதுவே நற்பண்புகளின் அரசியாகும். நாம் எவ்வளவு அதிகமாக அன்பு செலுத்துகிறோமோ, அவ்வளவுக்கு நாம் கடவுளை ஒத்தவர்களாகிறோம். நன்மை செய்வதில் சோர்வடையாமல் இருப்போம்; ஏனெனில் குறித்த நேரத்தில் நாம் விடாது இருந்தால் நித்திய மகிழ்ச்சியின் அறுவடையைப் பெறுவோம்.'
  },
  {
    id: 'office-patristic-004',
    refEn: 'From the writings of St. Bernard of Clairvaux, Abbot & Doctor',
    refTa: 'புனித பெர்னார்டு எழுதிய நூலிலிருந்து',
    textEn: 'What is the highest wisdom? It is to know Christ crucified. What is the truest knowledge? It is to meditate on the law of the Lord day and night. Let the soul seek the Word in silence and find its rest in the heart of God. For the Word is near us, in our mouth and in our heart.',
    textTa: 'உயர்ந்த ஞானம் எது? சிலுவையில் அறையப்பட்ட கிறிஸ்துவை அறிவதே. மெய்யான அறிவு எது? ஆண்டவரின் சட்டத்தை இரவும் பகலும் தியானிப்பதே. ஆன்மா அமைதியில் வார்த்தையைத் தேடி, கடவுளின் இதயத்தில் தன் ஓய்வைக் காணட்டும். ஏனெனில் வார்த்தை நமக்கு அருகில், நம் வாயிலும் நம் இதயத்திலும் இருக்கிறது.'
  },
  {
    id: 'office-patristic-005',
    refEn: 'From the treatise of St. Irenaeus, Bishop of Lyons',
    refTa: 'புனித இரனேயு எழுதிய உரையிலிருந்து',
    textEn: 'The glory of God is man fully alive, and the life of man consists in the vision of God. If the Son of God became man, it was so that we might become God. He took what was ours to give us what is His. Let us therefore offer ourselves entirely to Him, for He gave Himself entirely for us.',
    textTa: 'கடவுளின் மாட்சி முழுவதும் வாழும் மனிதர்; மனிதரின் வாழ்வு கடவுளைக் காண்பதில் உள்ளது. கடவுளின் மகன் மனிதரானார், நாம் கடவுளாக மாறவே. அவர் நம்முடையதை ஏற்றுக்கொண்டார், தம்முடையதை நமக்குக் கொடுக்க. ஆகையால் நாம் முழுவதுமாக நம்மை அவருக்குக் கொடுப்போம்; ஏனெனில் அவர் முழுவதுமாகத் தம்மை நமக்குக் கொடுத்தார்.'
  },
  {
    id: 'office-patristic-006',
    refEn: 'From the letter of St. Cyril of Alexandria, Bishop & Doctor',
    refTa: 'புனித சிரில் எழுதிய திருமுகத்திலிருந்து',
    textEn: 'Let us hold fast to the faith that works through love. The mystery of Christ fills the universe, yet He dwells in the humble heart. Do not seek Him far above in the heights; He is present in the breaking of the bread and in the community of believers. Open your eyes to see Him in the poor and the afflicted.',
    textTa: 'அன்பினால் செயல்படும் விசுவாசத்தை நாம் உறுதியாகப் பற்றிக்கொள்வோம். கிறிஸ்துவின் மறைபொருள் பிரபஞ்சத்தை நிரப்புகிறது, ஆனால் அவர் தாழ்ந்த இதயத்தில் குடியிருக்கிறார். உயரத்தில் அவரைத் தேடாதீர்கள்; அப்பம் பிட்கும்போதும் விசுவாசிகளின் சபையிலும் அவர் இருக்கிறார். ஏழைகளிலும் துன்புறுவோரிலும் அவரைக் காண உங்கள் கண்களைத் திறங்கள்.'
  },
  {
    id: 'office-patristic-007',
    refEn: 'From the catechism of St. Gregory of Nyssa, Bishop',
    refTa: 'புனித கிரகோரி நைசாவின் மறைப்போதனையிலிருந்து',
    textEn: 'The goal of a virtuous life is to become like God. Since the soul bears the image of the divine nature, it must continually polish that image through prayer and good works. Rise early to greet the Lord with a pure heart. Let the day begin with thanksgiving and end with the confession that God alone is holy.',
    textTa: 'நற்பண்பு வாழ்வின் இலக்கு கடவுளை ஒப்பதுவே. ஆன்மா தெய்வீக இயற்கையின் உருவத்தைத் தாங்கியிருப்பதால், அது இறைவேண்டல் மற்றும் நற்செயல்களால் அந்த உருவத்தை தொடர்ந்து தூய்மைப்படுத்த வேண்டும். தூய இதயத்துடன் ஆண்டவரை வரவேற்க அதிகாலையில் எழுங்கள். நன்றியுடன் நாளைத் தொடங்கி, கடவுள் ஒருவரே பரிசுத்தர் என்ற அறிக்கையுடன் முடியும்.'
  },
  {
    id: 'office-patristic-008',
    refEn: 'From a meditation by St. Ambrose, Bishop & Doctor',
    refTa: 'புனித அம்புரோசு எழுதிய தியானத்திலிருந்து',
    textEn: 'When we speak of wisdom, we speak of Christ. When we speak of virtue, we speak of Christ. When we speak of justice and truth and life and redemption, we speak of Christ. Therefore, let Christ be your first word, your last word, and every word in between. Let your every thought be shaped by the Gospel and your every action be guided by love.',
    textTa: 'ஞானத்தைப் பேசும்போது கிறிஸ்துவைப் பேசுகிறோம். நற்பண்பைப் பேசும்போது கிறிஸ்துவைப் பேசுகிறோம். நீதியையும் உண்மையையும் வாழ்வையும் மீட்பையும் பேசும்போது கிறிஸ்துவைப் பேசுகிறோம். ஆகவே, கிறிஸ்து உங்கள் முதல் வார்த்தையாகவும், இறுதி வார்த்தையாகவும், இடையே உள்ள ஒவ்வொரு வார்த்தையாகவும் இருக்கட்டும். நற்செய்தியால் உங்கள் ஒவ்வொரு எண்ணமும் வடிவமைக்கப்படட்டும், அன்பால் உங்கள் ஒவ்வொரு செயலும் வழிநடத்தப்படட்டும்.'
  },
];
