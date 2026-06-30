import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const prayers = [
  {
    category: 'morning',
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
    category: 'noon',
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
    category: 'evening',
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
    category: 'night',
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
    category: 'office',
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

for (const p of prayers) {
  const existing = await pb.collection('prayers').getFirstListItem(`category = "${p.category}"`);
  await pb.collection('prayers').update(existing.id, {
    contentEn: p.contentEn,
    contentTa: p.contentTa
  });
  console.log(`Updated ${p.category}: ${existing.id} (${p.contentEn.length} chars)`);
}

console.log('All prayers updated with full content!');

