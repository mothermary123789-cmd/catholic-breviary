import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

async function ensureCol(name, fields, rules) {
  try {
    const existing = await pb.collections.getOne(name).catch(() => null);
    if (existing) {
      // Update existing
      await pb.collections.update(existing.id, {
        fields: fields,
        listRule: rules.listRule,
        viewRule: rules.viewRule,
        createRule: rules.createRule,
        updateRule: rules.updateRule,
        deleteRule: rules.deleteRule,
      });
      console.log('Updated', name);
    } else {
      await pb.collections.create({
        name,
        type: 'base',
        fields,
        ...rules,
      });
      console.log('Created', name);
    }
  } catch (e) {
    console.error('Error with', name, ':', e.message);
  }
}

const PUBLIC_RULE = '@request.auth.id != ""';

await ensureCol('journalEntries', [
  { name: 'userId', type: 'text', required: true },
  { name: 'date', type: 'text', required: true },
  { name: 'title', type: 'text', required: true },
  { name: 'reflection', type: 'text', required: true },
  { name: 'associatedPrayerId', type: 'text' },
], {
  listRule: 'userId = @request.auth.id',
  viewRule: 'userId = @request.auth.id',
  createRule: PUBLIC_RULE,
  updateRule: 'userId = @request.auth.id',
  deleteRule: 'userId = @request.auth.id',
});

await ensureCol('bookmarks', [
  { name: 'userId', type: 'text', required: true },
  { name: 'itemType', type: 'select', required: true, options: { values: ['prayer', 'saint', 'reading'] } },
  { name: 'itemId', type: 'text', required: true },
  { name: 'titleEn', type: 'text', required: true },
  { name: 'titleTa', type: 'text', required: true },
], {
  listRule: 'userId = @request.auth.id',
  viewRule: 'userId = @request.auth.id',
  createRule: PUBLIC_RULE,
  updateRule: 'userId = @request.auth.id',
  deleteRule: 'userId = @request.auth.id',
});

console.log('Done');
