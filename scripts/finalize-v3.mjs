import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

// First, fix bookmarks collection with text type for itemType
let col = await pb.collections.getOne('bookmarks');
await pb.collections.update(col.id, {
  fields: [
    { name: 'userId', type: 'text', required: true },
    { name: 'itemType', type: 'text', required: true },
    { name: 'itemId', type: 'text', required: true },
    { name: 'titleEn', type: 'text', required: true },
    { name: 'titleTa', type: 'text', required: true },
  ],
  listRule: 'userId = @request.auth.id',
  viewRule: 'userId = @request.auth.id',
  createRule: '@request.auth.id != ""',
  updateRule: 'userId = @request.auth.id',
  deleteRule: 'userId = @request.auth.id',
});
console.log('Bookmarks updated with fields and rules');

// Verify prayers collection has correct fields
for (const name of ['prayers', 'saints', 'liturgicalDays', 'announcements', 'parishUsers', 'journalEntries', 'bookmarks']) {
  const c = await pb.collections.getOne(name);
  console.log(name, ':', c.fields.map(f => f.name).join(', '));
  console.log('  rules:', { list: c.listRule, create: c.createRule, delete: c.deleteRule });
}
