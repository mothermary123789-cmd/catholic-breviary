import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

// Public read, admin write for these collections
const publicRead = [
  'prayers', 'saints', 'liturgicalDays', 'announcements', 'parishUsers'
];

for (const name of publicRead) {
  const col = await pb.collections.getOne(name);
  await pb.collections.update(col.id, {
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
  });
  console.log('Updated', name, '- public read');
}

// User-scoped for these
const userScoped = ['journalEntries', 'bookmarks'];
for (const name of userScoped) {
  const col = await pb.collections.getOne(name);
  await pb.collections.update(col.id, {
    listRule: 'userId = @request.auth.id',
    viewRule: 'userId = @request.auth.id',
    createRule: '@request.auth.id != ""',
    updateRule: 'userId = @request.auth.id',
    deleteRule: 'userId = @request.auth.id',
  });
  console.log('Updated', name, '- user scoped');
}

console.log('Rules updated!');
