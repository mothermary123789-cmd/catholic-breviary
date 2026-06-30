import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

// Seed prayers
const prayers = [
  { category: 'morning', titleEn: 'Morning Prayer (Lauds) - Invitatory', titleTa: 'காலை வழிபாடு (புகழ்மாலை)', contentEn: 'Lord, open my lips...', contentTa: 'ஆண்டவரே, என் உதடுகளைத் திறந்தருளும்...' },
  { category: 'noon', titleEn: 'Midday Prayer (Sext)', titleTa: 'நண்பகல் வழிபாடு', contentEn: 'God, come to my assistance...', contentTa: 'இறைவா, எனக்குத் துணைசெய்ய எழுந்தருளும்...' },
  { category: 'evening', titleEn: 'Evening Prayer (Vespers)', titleTa: 'மாலை வழிபாடு', contentEn: 'God, come to my assistance...', contentTa: 'இறைவா, எனக்குத் துணைசெய்ய எழுந்தருளும்...' },
  { category: 'night', titleEn: 'Night Prayer (Compline)', titleTa: 'இரவு வழிபாடு', contentEn: 'May the Lord all-powerful grant us a restful night...', contentTa: 'எல்லாம் வல்ல ஆண்டவர் நமக்கு அமைதியான இரவையும்...' },
  { category: 'office', titleEn: 'Office of Readings (Matins)', titleTa: 'வாசகங்கள் வழிபாடு', contentEn: 'Lord, open my lips...', contentTa: 'ஆண்டவரே, என் உதடுகளைத் திறந்தருளும்...' },
];

for (const p of prayers) {
  const data = { ...p };
  const rec = await pb.collection('prayers').create(data);
  console.log('Created prayer:', rec.id);
}

// Seed saints
const saints = [
  { feastDate: '06-19', nameEn: 'St. Romuald, Abbot', nameTa: 'புனித ரொமுவால்டு, மடாதிபதி', lifeHistoryEn: 'Saint Romuald (c. 951 - June 19, 1027) was the founder of the Camaldolese order.', lifeHistoryTa: 'புனித ரொமுவால்டு (கி.பி. 951 - சூன் 19, 1027) கமல்டோலி துறவற சபையினைத் தோற்றுவித்தவர்.', imageUrl: 'https://images.unsplash.com/photo-1548625361-155deee2614a?w=400' },
  { feastDate: '06-21', nameEn: 'St. Aloysius Gonzaga, Religious', nameTa: 'புனித அலோசியஸ் கொன்சாகா, துறவி', lifeHistoryEn: 'Saint Aloysius Gonzaga (1568-1591) was an Italian aristocrat who became a Jesuit.', lifeHistoryTa: 'புனித அலோசியஸ் கொன்சாகா (1568-1591) இத்தாலிய பிரபு குடும்பத்தில் பிறந்து இயேசு சபையில் இணைந்த துறவி.', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400' },
  { feastDate: '08-15', nameEn: 'The Assumption of the Blessed Virgin Mary', nameTa: 'புனித கன்னி மரியாவின் விண்ணேற்பு', lifeHistoryEn: 'The Assumption of Mary into Heaven is the bodily taking up of the Virgin Mary into Heaven.', lifeHistoryTa: 'புனித கன்னி மரியா தனது உலக வாழ்வின் முடிவில் விண்ணகத்திற்கு எடுத்துக் கொள்ளப்பட்ட நிகழ்வே விண்ணேற்பு.', imageUrl: 'https://images.unsplash.com/photo-1601314002592-b873038687ea?w=400' },
];

for (const s of saints) {
  const data = { ...s };
  const rec = await pb.collection('saints').create(data);
  console.log('Created saint:', rec.id);
}

// Seed liturgical days
const days = [
  { date: '2026-06-19', seasonEn: 'Ordinary Time', seasonTa: 'சாதாரண காலம்', color: 'green', feastEn: 'Friday of the Eleventh Week', feastTa: 'சாதாரண கால பதினோராவது வாரம்', readingFirstRefEn: '2 Kings 11:1-4', readingFirstRefTa: '2 அரசர்கள் 11:1-4', readingFirstEn: 'Athaliah destroyed all the royal family.', readingFirstTa: 'அத்தாலியா அரச குலத்தார் அனைவரையும் அழித்தாள்.', psalmRefEn: 'Psalm 132:11', psalmRefTa: 'திருப்பாடல் 132:11', psalmEn: 'The Lord swore an oath to David.', psalmTa: 'ஆண்டவர் தாவீதுக்கு ஆணையிட்டார்.', gospelRefEn: 'Matthew 6:19-23', gospelRefTa: 'மத்தேயு 6:19-23', gospelEn: 'Do not lay up treasures on earth.', gospelTa: 'மண்ணுலகில் செல்வத்தைச் சேமிக்க வேண்டாம்.' },
  { date: '2026-06-20', seasonEn: 'Ordinary Time', seasonTa: 'சாதாரண காலம்', color: 'green', feastEn: 'Immaculate Heart of Mary', feastTa: 'மரியாவின் மாசற்ற இருதயம்', readingFirstRefEn: 'Isaiah 61:9-11', readingFirstRefTa: 'எசாயா 61:9-11', readingFirstEn: 'Their descendants shall be known.', readingFirstTa: 'அவர்களுடைய இனம் புகழ் பெற்றிருக்கும்.', psalmRefEn: '1 Samuel 2:1', psalmRefTa: '1 சாமுவேல் 2:1', psalmEn: 'My heart exults in the Lord.', psalmTa: 'என் உள்ளம் ஆண்டவரில் களிகூர்கின்றது.', gospelRefEn: 'Luke 2:41-51', gospelRefTa: 'லூக்கா 2:41-51', gospelEn: 'His parents went to Jerusalem.', gospelTa: 'இயேசுவின் பெற்றோர் எருசலேமுக்குப்போவார்கள்.' },
  { date: '2026-06-21', seasonEn: 'Ordinary Time', seasonTa: 'சாதாரண காலம்', color: 'white', feastEn: 'St. Aloysius Gonzaga Memorial', feastTa: 'புனித அலோசியஸ் கொன்சாகா நினைவு', readingFirstRefEn: '1 John 5:1-5', readingFirstRefTa: '1 யோவான் 5:1-5', readingFirstEn: 'Everyone who believes is a child of God.', readingFirstTa: 'இயேசு தான் கிறிஸ்து என்று நம்புவோர் கடவுளின் பிள்ளைகள்.', psalmRefEn: 'Psalm 16:1-2', psalmRefTa: 'திருப்பாடல் 16:1-2', psalmEn: 'Preserve me, O God.', psalmTa: 'இறைவா, என்னைக் காத்தருளும்.', gospelRefEn: 'Matthew 22:34-40', gospelRefTa: 'மத்தேயு 22:34-40', gospelEn: 'Love the Lord your God.', gospelTa: 'உன் இறைவனை அன்புகூர்வாயாக.' },
];

for (const d of days) {
  const data = { ...d };
  await pb.collection('liturgicalDays').create(data);
  console.log('Created liturgical day:', data.id);
}

console.log('Seeding complete!');
