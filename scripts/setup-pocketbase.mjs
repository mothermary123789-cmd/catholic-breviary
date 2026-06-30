import PocketBase from 'pocketbase';

const PB_URL = 'http://localhost:8090';
const ADMIN_EMAIL = 'mothermary123789@gmail.com';
const ADMIN_PASS = 'test123456';

const pb = new PocketBase(PB_URL);

async function main() {
  // First try to authenticate as superuser
  try {
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    console.log('Authenticated as superuser:', pb.authStore.isValid);
  } catch (e) {
    console.error('Auth failed:', e.message);
    return;
  }

  // Define collections to create
  const collections = [
    {
      name: 'prayers',
      type: 'base',
      schema: [
        { name: 'category', type: 'select', required: true, options: { values: ['morning', 'noon', 'evening', 'night', 'office'] } },
        { name: 'titleEn', type: 'text', required: true },
        { name: 'titleTa', type: 'text', required: true },
        { name: 'contentEn', type: 'text', required: true },
        { name: 'contentTa', type: 'text', required: true },
        { name: 'scriptureRefEn', type: 'text' },
        { name: 'scriptureRefTa', type: 'text' },
        { name: 'isCustom', type: 'bool' },
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    },
    {
      name: 'saints',
      type: 'base',
      schema: [
        { name: 'nameEn', type: 'text', required: true },
        { name: 'nameTa', type: 'text', required: true },
        { name: 'feastDate', type: 'text', required: true },
        { name: 'lifeHistoryEn', type: 'text', required: true },
        { name: 'lifeHistoryTa', type: 'text', required: true },
        { name: 'imageUrl', type: 'url' },
        { name: 'isCustom', type: 'bool' },
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    },
    {
      name: 'liturgicalDays',
      type: 'base',
      schema: [
        { name: 'date', type: 'text', required: true },
        { name: 'seasonEn', type: 'text', required: true },
        { name: 'seasonTa', type: 'text', required: true },
        { name: 'color', type: 'select', required: true, options: { values: ['purple', 'green', 'white', 'red'] } },
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
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    },
    {
      name: 'journalEntries',
      type: 'base',
      schema: [
        { name: 'user', type: 'relation', options: { collectionId: '_pb_users_', maxSelect: 1 } },
        { name: 'date', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'reflection', type: 'text', required: true },
        { name: 'associatedPrayerId', type: 'text' },
      ],
      listRule: '@request.auth.id = @collection.journalEntries.user.id',
      viewRule: '@request.auth.id = @collection.journalEntries.user.id',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id = @collection.journalEntries.user.id',
      deleteRule: '@request.auth.id = @collection.journalEntries.user.id',
    },
    {
      name: 'bookmarks',
      type: 'base',
      schema: [
        { name: 'user', type: 'relation', options: { collectionId: '_pb_users_', maxSelect: 1 } },
        { name: 'itemType', type: 'select', required: true, options: { values: ['prayer', 'saint', 'reading'] } },
        { name: 'itemId', type: 'text', required: true },
        { name: 'titleEn', type: 'text', required: true },
        { name: 'titleTa', type: 'text', required: true },
      ],
      listRule: '@request.auth.id = @collection.bookmarks.user.id',
      viewRule: '@request.auth.id = @collection.bookmarks.user.id',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id = @collection.bookmarks.user.id',
      deleteRule: '@request.auth.id = @collection.bookmarks.user.id',
    },
    {
      name: 'announcements',
      type: 'base',
      schema: [
        { name: 'titleEn', type: 'text', required: true },
        { name: 'titleTa', type: 'text', required: true },
        { name: 'descEn', type: 'text', required: true },
        { name: 'descTa', type: 'text', required: true },
        { name: 'date', type: 'text', required: true },
        { name: 'category', type: 'text', required: true },
        { name: 'theme', type: 'select', required: true, options: { values: ['gold', 'burgundy', 'indigo', 'charcoal'] } },
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    },
    {
      name: 'parishUsers',
      type: 'base',
      schema: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'email', type: 'email' },
        { name: 'phoneNumber', type: 'text' },
        { name: 'role', type: 'select', required: true, options: { values: ['parishioner', 'catechist', 'choir_leader', 'pastor'] } },
        { name: 'registeredDate', type: 'text', required: true },
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    },
  ];

  for (const col of collections) {
    try {
      const existing = await pb.collections.getOne(col.name).catch(() => null);
      if (existing) {
        console.log(`Collection "${col.name}" already exists, updating...`);
        await pb.collections.update(existing.id, col);
      } else {
        console.log(`Creating collection "${col.name}"...`);
        await pb.collections.create(col);
      }
    } catch (e) {
      console.error(`Failed to upsert collection "${col.name}":`, e.message);
    }
  }

  // Create a users collection for regular auth (if not exists)
  try {
    const usersCol = await pb.collections.getOne('users').catch(() => null);
    if (!usersCol) {
      console.log('Creating users auth collection...');
      await pb.collections.create({
        name: 'users',
        type: 'auth',
        schema: [
          { name: 'name', type: 'text' },
        ],
        passwordAuth: { enabled: true },
        listRule: 'id = @request.auth.id',
        viewRule: 'id = @request.auth.id',
        createRule: '',
        updateRule: 'id = @request.auth.id',
        deleteRule: 'id = @request.auth.id',
      });
    }
  } catch (e) {
    console.error('Failed to create users collection:', e.message);
  }

  console.log('Setup complete!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
