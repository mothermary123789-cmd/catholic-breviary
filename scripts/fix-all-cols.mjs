import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('mothermary123789@gmail.com', 'test123456');

const PUBLIC_READ = { listRule: '', viewRule: '', createRule: '@request.auth.id != ""', updateRule: '@request.auth.id != ""', deleteRule: '@request.auth.id != ""' };
const USER_SCOPED = { listRule: 'userId = @request.auth.id', viewRule: 'userId = @request.auth.id', createRule: '@request.auth.id != ""', updateRule: 'userId = @request.auth.id', deleteRule: 'userId = @request.auth.id' };

const defs = {
  prayers: {
    fields: [
      { name: 'category', type: 'select', required: true, options: { values: ['morning', 'noon', 'evening', 'night', 'office'], maxSelect: 1 } },
      { name: 'titleEn', type: 'text', required: true },
      { name: 'titleTa', type: 'text', required: true },
      { name: 'contentEn', type: 'text', required: true },
      { name: 'contentTa', type: 'text', required: true },
      { name: 'scriptureRefEn', type: 'text' },
      { name: 'scriptureRefTa', type: 'text' },
      { name: 'isCustom', type: 'bool' },
    ],
    rules: PUBLIC_READ,
  },
  saints: {
    fields: [
      { name: 'nameEn', type: 'text', required: true },
      { name: 'nameTa', type: 'text', required: true },
      { name: 'feastDate', type: 'text', required: true },
      { name: 'lifeHistoryEn', type: 'text', required: true },
      { name: 'lifeHistoryTa', type: 'text', required: true },
      { name: 'imageUrl', type: 'url' },
      { name: 'isCustom', type: 'bool' },
    ],
    rules: PUBLIC_READ,
  },
  liturgicalDays: {
    fields: [
      { name: 'date', type: 'text', required: true },
      { name: 'seasonEn', type: 'text', required: true },
      { name: 'seasonTa', type: 'text', required: true },
      { name: 'color', type: 'select', required: true, options: { values: ['purple', 'green', 'white', 'red'], maxSelect: 1 } },
      { name: 'feastEn', type: 'text', required: true },
      { name: 'feastTa', type: 'text', required: true },
      { name: 'readingFirstRefEn', type: 'text', required: true },
      { name: 'readingFirstRefTa', type: 'text', required: true },
      { name: 'readingFirstEn', type: 'text', required: true },
      { name: 'readingFirstTa', type: 'text', required: true },
      { name: 'psalmRefEn', type: 'text', required: true },
      { name: 'psalmRefTa', type: 'text', required: true },
      { name: 'psalmEn', type: 'text', required: true },
      { name: 'psalmTa', type: 'text', required: true },
      { name: 'gospelRefEn', type: 'text', required: true },
      { name: 'gospelRefTa', type: 'text', required: true },
      { name: 'gospelEn', type: 'text', required: true },
      { name: 'gospelTa', type: 'text', required: true },
      { name: 'officeRefEn', type: 'text' },
      { name: 'officeRefTa', type: 'text' },
      { name: 'officeEn', type: 'text' },
      { name: 'officeTa', type: 'text' },
      { name: 'isCustom', type: 'bool' },
    ],
    rules: PUBLIC_READ,
  },
  announcements: {
    fields: [
      { name: 'titleEn', type: 'text', required: true },
      { name: 'titleTa', type: 'text', required: true },
      { name: 'descEn', type: 'text', required: true },
      { name: 'descTa', type: 'text', required: true },
      { name: 'date', type: 'text', required: true },
      { name: 'category', type: 'text', required: true },
      { name: 'theme', type: 'text', required: true },
    ],
    rules: PUBLIC_READ,
  },
  parishUsers: {
    fields: [
      { name: 'fullName', type: 'text', required: true },
      { name: 'email', type: 'email' },
      { name: 'phoneNumber', type: 'text' },
      { name: 'role', type: 'text', required: true },
      { name: 'registeredDate', type: 'text', required: true },
    ],
    rules: PUBLIC_READ,
  },
};

for (const [name, def] of Object.entries(defs)) {
  try {
    const col = await pb.collections.getOne(name);
    await pb.collections.update(col.id, {
      fields: def.fields,
      ...def.rules,
    });
    console.log('Fixed', name);
  } catch (e) {
    console.error('Failed', name, ':', e.message);
  }
}

// Verify
for (const name of Object.keys(defs).concat(['journalEntries', 'bookmarks'])) {
  const col = await pb.collections.getOne(name);
  const fieldNames = col.fields.map(f => f.name).join(', ');
  console.log(name, 'fields:', fieldNames);
  console.log('  listRule:', col.listRule);
}
