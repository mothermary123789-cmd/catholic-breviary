import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const RULE = '@request.auth.id != ""';

async function createCol(name, schema) {
  try {
    const existing = await pb.collections.getOne(name).catch(() => null);
    if (existing) {
      await pb.collections.update(existing.id, { schema });
      console.log('Updated', name);
      return;
    }
    await pb.collections.create({
      name,
      type: 'base',
      schema,
      listRule: RULE,
      viewRule: RULE,
      createRule: RULE,
      updateRule: RULE,
      deleteRule: RULE,
    });
    console.log('Created', name);
  } catch (e) {
    console.error('Error with', name, ':', e.message);
  }
}

await createCol('journalEntries', [
  { name: 'userId', type: 'text', required: true },
  { name: 'date', type: 'text', required: true },
  { name: 'title', type: 'text', required: true },
  { name: 'reflection', type: 'text', required: true },
  { name: 'associatedPrayerId', type: 'text' },
]);

await createCol('bookmarks', [
  { name: 'userId', type: 'text', required: true },
  { name: 'itemType', type: 'select', required: true, options: { values: ['prayer', 'saint', 'reading'] } },
  { name: 'itemId', type: 'text', required: true },
  { name: 'titleEn', type: 'text', required: true },
  { name: 'titleTa', type: 'text', required: true },
]);

console.log('Done');
