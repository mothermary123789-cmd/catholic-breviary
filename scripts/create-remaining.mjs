import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const colDefs = [
  {
    name: 'journalEntries',
    schema: [
      { name: 'userId', type: 'text', required: true },
      { name: 'date', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
      { name: 'reflection', type: 'text', required: true },
      { name: 'associatedPrayerId', type: 'text' },
    ],
  },
  {
    name: 'bookmarks',
    schema: [
      { name: 'userId', type: 'text', required: true },
      { name: 'itemType', type: 'select', required: true, options: { values: ['prayer', 'saint', 'reading'] } },
      { name: 'itemId', type: 'text', required: true },
      { name: 'titleEn', type: 'text', required: true },
      { name: 'titleTa', type: 'text', required: true },
    ],
  },
];

for (const def of colDefs) {
  try {
    const existing = await pb.collections.getOne(def.name).catch(() => null);
    if (existing) {
      console.log(`Collection "${def.name}" already exists, updating...`);
      await pb.collections.update(existing.id, {
        schema: def.schema,
        listRule: `userId = @request.auth.id`,
        viewRule: `userId = @request.auth.id`,
        createRule: `@request.auth.id != ""`,
        updateRule: `userId = @request.auth.id`,
        deleteRule: `userId = @request.auth.id`,
      });
    } else {
      console.log(`Creating collection "${def.name}"...`);
      await pb.collections.create({
        name: def.name,
        type: 'base',
        schema: def.schema,
        listRule: `userId = @request.auth.id`,
        viewRule: `userId = @request.auth.id`,
        createRule: `@request.auth.id != ""`,
        updateRule: `userId = @request.auth.id`,
        deleteRule: `userId = @request.auth.id`,
      });
    }
  } catch (e) {
    console.error(`Failed for "${def.name}":`, e.message);
  }
}

console.log('Done');
