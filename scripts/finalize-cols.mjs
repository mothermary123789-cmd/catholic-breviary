import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const configs = {
  journalEntries: {
    schema: [
      { name: 'userId', type: 'text', required: true },
      { name: 'date', type: 'text', required: true },
      { name: 'title', type: 'text', required: true },
      { name: 'reflection', type: 'text', required: true },
      { name: 'associatedPrayerId', type: 'text' },
    ],
  },
  bookmarks: {
    schema: [
      { name: 'userId', type: 'text', required: true },
      { name: 'itemType', type: 'select', required: true, options: { values: ['prayer', 'saint', 'reading'] } },
      { name: 'itemId', type: 'text', required: true },
      { name: 'titleEn', type: 'text', required: true },
      { name: 'titleTa', type: 'text', required: true },
    ],
  },
};

for (const [name, config] of Object.entries(configs)) {
  try {
    const col = await pb.collections.getOne(name);
    // First update schema without the user-scoped rules
    await pb.collections.update(col.id, {
      schema: config.schema,
    });
    console.log('Updated schema for', name);
  } catch (e) {
    console.error('Error updating', name, ':', e.message);
  }
}

// Now apply rules separately
for (const [name, config] of Object.entries(configs)) {
  try {
    const col = await pb.collections.getOne(name);
    await pb.collections.update(col.id, {
      schema: config.schema,
      listRule: 'userId = @request.auth.id',
      viewRule: 'userId = @request.auth.id',
      createRule: '@request.auth.id != ""',
      updateRule: 'userId = @request.auth.id',
      deleteRule: 'userId = @request.auth.id',
    });
    console.log('Applied rules for', name);
  } catch (e) {
    console.error('Error applying rules for', name, ':', e.message);
  }
}

// Verify
for (const name of ['journalEntries', 'bookmarks']) {
  const col = await pb.collections.getOne(name);
  console.log(name, 'schema:', col.schema.map(f => f.name + ':' + f.type).join(', '));
}

console.log('Done');
