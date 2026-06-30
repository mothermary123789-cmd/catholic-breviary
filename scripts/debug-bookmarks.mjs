import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const col = await pb.collections.getOne('bookmarks');
console.log('Fields:', JSON.stringify(col.fields.map(f => f.name + ':' + f.type)));

try {
  // First just update fields without rules
  await pb.collections.update(col.id, {
    fields: [
      { name: 'userId', type: 'text', required: true },
      { name: 'itemType', type: 'select', required: true, options: { values: ['prayer', 'saint', 'reading'] } },
      { name: 'itemId', type: 'text', required: true },
      { name: 'titleEn', type: 'text', required: true },
      { name: 'titleTa', type: 'text', required: true },
    ],
  });
  console.log('Fields updated');
} catch (e) {
  console.log('Fields update error:', e.message);
}

const col2 = await pb.collections.getOne('bookmarks');
try {
  await pb.collections.update(col2.id, {
    fields: col2.fields,
    listRule: 'userId = @request.auth.id',
    viewRule: 'userId = @request.auth.id',
    createRule: '@request.auth.id != ""',
    updateRule: 'userId = @request.auth.id',
    deleteRule: 'userId = @request.auth.id',
  });
  console.log('Rules updated');
} catch (e) {
  console.log('Rules update error:', e.message, JSON.stringify(e.data));
}
