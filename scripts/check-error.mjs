import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const col = await pb.collections.getOne('journalEntries');
console.log('Schema fields:', col.schema.map(f => `${f.name}:${f.type}`).join(', '));

try {
  const result = await pb.collections.update(col.id, {
    schema: col.schema,
    listRule: 'userId = @request.auth.id',
    viewRule: 'userId = @request.auth.id',
  });
  console.log('OK');
} catch (e) {
  console.log('Status:', e.status);
  console.log('Message:', e.message);
  console.log('Data:', JSON.stringify(e.data, null, 2));
}
