import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const saints = [
  {
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

const liturgicalDays = [
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
    color: 'white',
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

// Update saints
for (const s of saints) {
  const existing = await pb.collection('saints').getFirstListItem(`feastDate = "${s.feastDate}"`);
  await pb.collection('saints').update(existing.id, {
    nameEn: s.nameEn,
    nameTa: s.nameTa,
    lifeHistoryEn: s.lifeHistoryEn,
    lifeHistoryTa: s.lifeHistoryTa,
    imageUrl: s.imageUrl
  });
  console.log(`Updated saint ${s.nameEn}: ${existing.id} (${s.lifeHistoryEn.length} chars)`);
}

// Update liturgical days (create if doesn't exist)
for (const d of liturgicalDays) {
  let existing;
  try {
    existing = await pb.collection('liturgicalDays').getFirstListItem(`date = "${d.date}"`);
    await pb.collection('liturgicalDays').update(existing.id, d);
    console.log(`Updated liturgical day ${d.date} (${d.feastEn}): ${existing.id}`);
  } catch (e) {
    await pb.collection('liturgicalDays').create(d);
    console.log(`Created liturgical day ${d.date} (${d.feastEn})`);
  }
}

console.log('All saints and liturgical days updated with full content!');
