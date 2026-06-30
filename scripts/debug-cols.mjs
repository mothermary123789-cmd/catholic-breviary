import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const col = await pb.collections.getOne('journalEntries');
console.log('Keys:', Object.keys(col));
console.log('Has schema:', col.schema !== undefined);
console.log('Full object:', JSON.stringify(col, null, 2).substring(0, 500));
