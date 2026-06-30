import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

// Seed prayers
const prayers = [
  { id: 'morning-1', category: 'morning', titleEn: 'Morning Prayer (Lauds) - Invitatory', titleTa: 'காலை வழிபாடு (புகழ்மாலை) - அழைப்புரை', contentEn: 'Lord, open my lips.\nAnd my mouth shall declare your praise.\n\nGlory to the Father, and to the Son, and to the Holy Spirit.\nAs it was in the beginning, is now, and will be forever. Amen. Alleluia.\n\n[Hymn: Morning Light]\nThe darkness is fading, the new day is born,\nWe lift up our voices to welcome the morn.\nGrant us, O Father, to walk in Your light,\nProtected and guided by grace in Your sight.\n\n[Psalm 95 - Invitatory Psalm]\nCome, let us sing to the Lord and shout with joy to the Rock who saves us.\nLet us approach him with praise and thanksgiving, and sing joyful songs to the Lord.\n\nThe Lord is God, a great King above all gods.\nIn his hands are the depths of the earth; the heights of the mountains are his.\n\n[Concluding Prayer & Blessing]\nLord, fill our hearts with your love as the dawn breaks. Amen.', contentTa: 'ஆண்டவரே, என் உதடுகளைத் திறந்தருளும்.\nஎன் வாய் உமது புகழை எடுத்தியம்பும்.\n\nதந்தைக்கும் மகனுக்கும் தூய ஆவியாருக்கும் ஆட்சிமை உண்டாகுக.\nதொடக்கத்தில் இருந்ததுபோல இப்பொழுதும் எப்பொழுதும் என்றென்றும் இருப்பதாக. ஆமென். அல்லேலூயா.\n\n[காலை ஒளி பாடல்]\nஇருளெல்லாம் மறைந்தது, புது விடியல் பிறந்தது.\n\n[திருப்பாடல் 95]\nவாருங்கள், ஆண்டவரைப் புகழ்ந்து பாடுங்கள்.\n\n[நிறைவு மன்றாட்டு]\nஆண்டவரே, விடியற்காலையில் உமது பேரன்பால் எங்களை நிரப்பியருளும். ஆமென்.' },
  { id: 'noon-1', category: 'noon', titleEn: 'Midday Prayer (Sext)', titleTa: 'நண்பகல் வழிபாடு (இருதயமாலை)', contentEn: 'God, come to my assistance.\nLord, make haste to help me.\n\nGlory to the Father, and to the Son, and to the Holy Spirit.\nAs it was in the beginning, is now, and will be forever. Amen. Alleluia.\n\n[Hymn: Midday Peace]\nNow at the turning of the sun,\nThe labor of the day is run.\n\n[Concluding Prayer]\nLord God, Savior of mankind, fill our remaining hours with Your peace. Amen.', contentTa: 'இறைவா, எனக்குத் துணைசெய்ய எழுந்தருளும்.\nஆண்டவரே, எனக்கு உதவி செய்ய விரைந்து வாரும்.\n\nதந்தைக்கும் மகனுக்கும் தூய ஆவியாருக்கும் ஆட்சிமை உண்டாகுக.\n\n[நிறைவு மன்றாட்டு]\nமனிதகுலத்தை மீட்கும் இறைவா, எங்கள் ஆண்டவராகிய இயேசு கிறிஸ்து வழியாக உம்மை மன்றாடுகிறோம். ஆமென்.' },
  { id: 'evening-1', category: 'evening', titleEn: 'Evening Prayer (Vespers)', titleTa: 'மாலை வழிபாடு', contentEn: 'God, come to my assistance.\nLord, make haste to help me.\n\nGlory to the Father, and to the Son, and to the Holy Spirit.\nAs it was in the beginning, is now, and will be forever. Amen. Alleluia.\n\n[Hymn: Evening Light]\nO radiant Light, O Sun divine,\nUpon our hearts in beauty shine.\n\n[Psalm 141 - Incense Prayer]\nLet my prayer rise like incense before you, O Lord.\n\n[The Magnificat]\nMy soul proclaims the greatness of the Lord,\nmy spirit rejoices in God my Savior.\n\n[Concluding Prayer]\nStay with us, Lord, for evening draws near. Amen.', contentTa: 'இறைவா, எனக்குத் துணைசெய்ய எழுந்தருளும்.\nஆண்டவரே, எனக்கு உதவி செய்ய விரைந்து வாரும்.\n\n[மரியாவின் புகழ்ப்பாடல்]\nஎன் ஆன்மா ஆண்டவரைப் பெருமைப்படுத்துகின்றது.\n\n[நிறைவு மன்றாட்டு]\nஆண்டவரே, எங்களோடு தங்கியிரும். ஆமென்.' },
  { id: 'night-1', category: 'night', titleEn: 'Night Prayer (Compline)', titleTa: 'இரவு வழிபாடு (நிறைவுமாலை)', contentEn: 'May the Lord all-powerful grant us a restful night and a peaceful death. Amen.\n\n[Examination of Conscience]\n\n[Psalm 91 - Assurance of Salvation]\nHe who dwells in the shelter of the Most High.\n\n[Canticle of Simeon - Nunc Dimittis]\nProtect us, Lord, as we stay awake.\n\nGlory to the Father, and to the Son, and to the Holy Spirit. Amen.', contentTa: 'எல்லாம் வல்ல ஆண்டவர் நமக்கு அமைதியான இரவையும் நல்மரணத்தையும் தந்தருளுவாராக. ஆமென்.\n\n[திருப்பாடல் 91]\nஉன்னதரின் மறைவில் வாழ்பவர்.\n\n[சிமியோனின் புகழ்ப்பாடல்]\nஆண்டவரே, விழித்திருக்கும்போது எங்களைக் காத்தருளும். ஆமென்.' },
  { id: 'office-1', category: 'office', titleEn: 'Office of Readings (Matins)', titleTa: 'வாசகங்கள் வழிபாடு', contentEn: 'Lord, open my lips.\nAnd my mouth shall declare your praise.\n\n[Psalm 19 - The Praise of God Law]\nThe heavens declare the glory of God.\n\n[Concluding Prayer]\nLord, grant us to read with understanding. Amen.', contentTa: 'ஆண்டவரே, என் உதடுகளைத் திறந்தருளும்.\nஎன் வாய் உமது புகழையே பாடும்.\n\n[நிறைவு மன்றாட்டு]\nஆண்டவரே, உமது வார்த்தைகளை நாங்கள் ஆழமாகப் புரிந்து வாசிக்கவும் அருள் தாரும். ஆமென்.' },
];

for (const p of prayers) {
  const exists = await pb.collection('prayers').getOne(p.id).catch(() => null);
  if (!exists) {
    await pb.collection('prayers').create(p);
    console.log('Created prayer:', p.id);
  } else {
    console.log('Prayer exists:', p.id);
  }
}

// Seed saints
const saints = [
  { id: 'saint-romuald', feastDate: '06-19', nameEn: 'St. Romuald, Abbot', nameTa: 'புனித ரொமுவால்டு, மடாதிபதி', lifeHistoryEn: 'Saint Romuald (c. 951 - June 19, 1027) was the founder of the Camaldolese order. He is a patron saint against cold and for contemplatives.', lifeHistoryTa: 'புனித ரொமுவால்டு (கி.பி. 951 - சூன் 19, 1027) கமல்டோலி துறவற சபையினைத் தோற்றுவித்தவர் ஆவார். இவர் தியான வாழ்வை மேற்கொள்பவர்களின் பாதுகாவலர் ஆவார்.', imageUrl: 'https://images.unsplash.com/photo-1548625361-155deee2614a?w=400' },
  { id: 'saint-aloysius', feastDate: '06-21', nameEn: 'St. Aloysius Gonzaga, Religious', nameTa: 'புனித அலோசியஸ் கொன்சாகா, துறவி', lifeHistoryEn: 'Saint Aloysius Gonzaga (1568-1591) was an Italian aristocrat who became a Jesuit. Patron saint of Christian youth and students.', lifeHistoryTa: 'புனித அலோசியஸ் கொன்சாகா (1568-1591) இத்தாலிய பிரபு குடும்பத்தில் பிறந்து இயேசு சபையில் இணைந்த துறவி ஆவார். இவர் கிறித்தவ இளைஞர்களின் பாதுகாவலர்.', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400' },
  { id: 'saint-mother-mary', feastDate: '08-15', nameEn: 'The Assumption of the Blessed Virgin Mary', nameTa: 'புனித கன்னி மரியாவின் விண்ணேற்பு', lifeHistoryEn: 'The Assumption of Mary into Heaven is the bodily taking up of the Virgin Mary into Heaven at the end of her earthly life.', lifeHistoryTa: 'புனித கன்னி மரியா தனது உலக வாழ்வின் முடிவில் உடலோடும் ஆன்மாவோடும் விண்ணகத்திற்கு எடுத்துக் கொள்ளப்பட்ட நிகழ்வே விண்ணேற்பு பெருவிழா ஆகும்.', imageUrl: 'https://images.unsplash.com/photo-1601314002592-b873038687ea?w=400' },
];

for (const s of saints) {
  const exists = await pb.collection('saints').getOne(s.id).catch(() => null);
  if (!exists) {
    await pb.collection('saints').create(s);
    console.log('Created saint:', s.id);
  }
}

// Seed liturgical days
const days = [
  { id: '2026-06-19', date: '2026-06-19', seasonEn: 'Ordinary Time', seasonTa: 'சாதாரண காலம்', color: 'green', feastEn: 'Friday of the Eleventh Week in Ordinary Time', feastTa: 'சாதாரண காலத்தின் பதினோராவது வாரத்தின் வெள்ளிக்கிழமை', readingFirstRefEn: '2 Kings 11:1-4, 9-18, 20', readingFirstRefTa: '2 அரசர்கள் 11:1-4, 9-18, 20', readingFirstEn: 'Athaliah the mother of Ahaziah saw that her son was dead, she arose and destroyed all the royal family.', readingFirstTa: 'அகசியாவின் தாய் அத்தாலியா தன் மகன் இறந்துவிட்டதைக் கண்டபோது, அரச குலத்தார் அனைவரையும் அழிக்கத் தொடங்கினாள்.', psalmRefEn: 'Psalm 132:11, 12, 13-14, 17-18', psalmRefTa: 'திருப்பாடல் 132:11, 12, 13-14, 17-18', psalmEn: 'The Lord swore an oath to David.', psalmTa: 'ஆண்டவர் தாவீதுக்கு உண்மையாய் ஆணையிட்டுக் கூறினார்.', gospelRefEn: 'Matthew 6:19-23', gospelRefTa: 'மத்தேயு 6:19-23', gospelEn: 'Jesus said to his disciples: "Do not lay up for yourselves treasures on earth."', gospelTa: 'இயேசு தம் சீடர்களை நோக்கிக் கூறியது: "மண்ணுலகில் உங்களுக்கெனச் செல்வத்தைச் சேமித்து வைக்க வேண்டாம்."' },
  { id: '2026-06-20', date: '2026-06-20', seasonEn: 'Ordinary Time', seasonTa: 'சாதாரண காலம்', color: 'green', feastEn: 'Immaculate Heart of Mary', feastTa: 'மரியாவின் மாசற்ற இருதயம்', readingFirstRefEn: 'Isaiah 61:9-11', readingFirstRefTa: 'எசாயா 61:9-11', readingFirstEn: 'Their descendants shall be known among the nations.', readingFirstTa: 'அவர்களுடைய இனம் பிற இனத்தாரிடையே புகழ் பெற்றிருக்கும்.', psalmRefEn: '1 Samuel 2:1, 4-5, 6-7, 8', psalmRefTa: '1 சாமுவேல் 2:1, 4-5, 6-7, 8', psalmEn: 'My heart exults in the Lord.', psalmTa: 'என் உள்ளம் ஆண்டவரில் களிகூர்கின்றது.', gospelRefEn: 'Luke 2:41-51', gospelRefTa: 'லூக்கா 2:41-51', gospelEn: 'His parents went to Jerusalem every year at the feast of the Passover.', gospelTa: 'இயேசுவின் பெற்றோர் ஆண்டுதோறும் பாஸ்கா விழாவைக் கொண்டாட எருசலேமுக்குப்போவார்கள்.' },
  { id: '2026-06-21', date: '2026-06-21', seasonEn: 'Ordinary Time', seasonTa: 'சாதாரண காலம்', color: 'white', feastEn: 'St. Aloysius Gonzaga, Religious - Memorial', feastTa: 'புனித அலோசியஸ் கொன்சாகா, துறவி - நினைவு', readingFirstRefEn: '1 John 5:1-5', readingFirstRefTa: '1 யோவான் 5:1-5', readingFirstEn: 'Everyone who believes that Jesus is the Christ is a child of God.', readingFirstTa: 'இயேசு தான் கிறிஸ்து என்று நம்புவோர் அனைவரும் கடவுளிடமிருந்து பிறந்தவர்கள்.', psalmRefEn: 'Psalm 16:1-2, 5, 7-8, 11', psalmRefTa: 'திருப்பாடல் 16:1-2, 5, 7-8, 11', psalmEn: 'Preserve me, O God, for in thee I take refuge.', psalmTa: 'இறைவா, என்னைக் காத்தருளும்; நான் உம்மிடம் அடைக்கலம் புகுந்துள்ளேன்.', gospelRefEn: 'Matthew 22:34-40', gospelRefTa: 'மத்தேயு 22:34-40', gospelEn: 'When the Pharisees heard that he had silenced the Sadducees, they came together.', gospelTa: 'இயேசு சதுசேயரை வாயடைக்கச் செய்ததைப் பரிசேயர் கேள்விப்பட்டு ஒன்றுகூடி வந்தனர்.' },
  { id: '2026-08-15', date: '2026-08-15', seasonEn: 'Ordinary Time', seasonTa: 'சாதாரண காலம்', color: 'white', feastEn: 'The Assumption of the Blessed Virgin Mary', feastTa: 'புனித கன்னி மரியாவின் விண்ணேற்பு', readingFirstRefEn: 'Revelation 11:19; 12:1-6, 10', readingFirstRefTa: 'திருவெளிப்பாடு 11:19; 12:1-6, 10', readingFirstEn: 'God temple in heaven was opened, and the ark of his covenant was seen within his temple.', readingFirstTa: 'விண்ணுலகில் இருந்த இறைவனின் ஆலயம் திறக்கப்பட்டது.', psalmRefEn: 'Psalm 45:10-12, 16', psalmRefTa: 'திருப்பாடல் 45:10-12, 16', psalmEn: 'The queen stands at your right hand, arrayed in gold.', psalmTa: 'அரசி உமது வலப்பக்கத்தில் நிற்கின்றாள்.', gospelRefEn: 'Luke 1:39-56', gospelRefTa: 'லூக்கா 1:39-56', gospelEn: 'Mary set out and went with haste to a Judean town in the hill country.', gospelTa: 'மரியா புறப்பட்டு மலைநாட்டிலுள்ள யூதேயா நகருக்கு விரைந்து சென்றார்.' },
];

for (const d of days) {
  const exists = await pb.collection('liturgicalDays').getOne(d.id).catch(() => null);
  if (!exists) {
    await pb.collection('liturgicalDays').create(d);
    console.log('Created liturgical day:', d.id);
  }
}

console.log('Seeding complete!');
