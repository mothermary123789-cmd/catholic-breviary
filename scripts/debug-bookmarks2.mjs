import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const col = await pb.collections.getOne('bookmarks');
console.log('Current fields:', JSON.stringify(col.fields));

// Try without the select options
for (const fieldDef of [
  [
    { name: 'userId', type: 'text', required: true },
    { name: 'itemType', type: 'text', required: true },
    { name: 'itemId', type: 'text', required: true },
    { name: 'titleEn', type: 'text', required: true },
    { name: 'titleTa', type: 'text', required: true },
  ],
  [
    { name: 'userId', type: 'text', required: true },
    { name: 'itemType', type: 'select', required: true, options: { values: ['prayer', 'saint', 'reading'], maxSelect: 1 } },
    { name: 'itemId', type: 'text', required: true },
    { name: 'titleEn', type: 'text', required: true },
    { name: 'titleTa', type: 'text', required: true },
  ],
]) {
  try {
    await pb.collections.update(col.id, {
      fields: fieldDef,
    });
    console.log('Success with:', JSON.stringify(fieldDef.map(f => f.name + ':' + f.type)));
    break;
  } catch (e) {
    console.log('Failed with:', JSON.stringify(fieldDef.map(f => f.name + ':' + f.type)), '-', e.message);
  }
}
