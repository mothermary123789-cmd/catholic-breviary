import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

async function updateCol(name, fields) {
  const col = await pb.collections.getOne(name);
  await pb.collections.update(col.id, {
    fields,
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
  });
  console.log('Updated', name);
}

await updateCol('prayers', [
  { name: 'category', type: 'text', required: true },
  { name: 'titleEn', type: 'text', required: true },
  { name: 'titleTa', type: 'text', required: true },
  { name: 'contentEn', type: 'text', required: true },
  { name: 'contentTa', type: 'text', required: true },
  { name: 'scriptureRefEn', type: 'text' },
  { name: 'scriptureRefTa', type: 'text' },
  { name: 'isCustom', type: 'bool' },
]);

await updateCol('liturgicalDays', [
  { name: 'date', type: 'text', required: true },
  { name: 'seasonEn', type: 'text', required: true },
  { name: 'seasonTa', type: 'text', required: true },
  { name: 'color', type: 'text', required: true },
  { name: 'feastEn', type: 'text', required: true },
  { name: 'feastTa', type: 'text', required: true },
  { name: 'readingFirstRefEn', type: 'text', required: true },
  { name: 'readingFirstRefTa', type: 'text', required: true },
  { name: 'readingFirstEn', type: 'text', required: true },
  { name: 'readingFirstTa', type: 'text', required: true },
  { name: 'psalmRefEn', type: 'text', required: true },
  { name: 'psalmRefTa', type: 'text', required: true },
  { name: 'psalmEn', type: 'text', required: true },
  { name: 'psalmTa', type: 'text', required: true },
  { name: 'gospelRefEn', type: 'text', required: true },
  { name: 'gospelRefTa', type: 'text', required: true },
  { name: 'gospelEn', type: 'text', required: true },
  { name: 'gospelTa', type: 'text', required: true },
  { name: 'officeRefEn', type: 'text' },
  { name: 'officeRefTa', type: 'text' },
  { name: 'officeEn', type: 'text' },
  { name: 'officeTa', type: 'text' },
  { name: 'isCustom', type: 'bool' },
]);

// Verify
for (const name of ['prayers', 'liturgicalDays']) {
  const col = await pb.collections.getOne(name);
  console.log(name, 'fields:', col.fields.map(f => f.name).join(', '));
}
