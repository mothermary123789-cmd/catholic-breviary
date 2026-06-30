# PocketBase Migration Guide — Step by Step

This guide documents every step taken to replace Firebase with PocketBase in the Catholic Breviary app. Follow in order.

---

## Step 1: Install PocketBase SDK

```bash
npm install pocketbase
```

Uninstall Firebase (do this after confirming PB works):

```bash
npm uninstall firebase
```

---

## Step 2: Download & Start PocketBase Server

Download `pocketbase.exe` from https://pocketbase.io/docs/ and place it in `pocketbase/`.

```bash
mkdir -p pocketbase
# Place pocketbase.exe in pocketbase/
./pocketbase/pocketbase.exe serve
```

Open `http://localhost:8090/\_/` in browser.

---

## Step 3: Create Collections (via Admin UI)

Login at `http://localhost:8090/_/` with superuser credentials.

Create these collections (all with `fields` array — PocketBase v0.39+):

### prayers

| Field | Type | Details |
|-------|------|---------|
| category | text | Required |
| titleEn | text | Required |
| titleTa | text | Optional |
| contentEn | text (long) | Required |
| contentTa | text (long) | Optional |

### saints

| Field | Type | Details |
|-------|------|---------|
| feastDate | text | Required (e.g. `06-19`) |
| nameEn | text | Required |
| nameTa | text | Optional |
| lifeHistoryEn | text (long) | Optional |
| lifeHistoryTa | text (long) | Optional |
| imageUrl | text | Optional |

### liturgicalDays

Add all fields from the seed data type — `date`, `seasonEn`, `seasonTa`, `color`, `feastEn`, `feastTa`, `readingFirstRefEn`, `readingFirstRefTa`, `readingFirstEn`, `readingFirstTa`, `psalmRefEn`, `psalmRefTa`, `psalmEn`, `psalmTa`, `gospelRefEn`, `gospelRefTa`, `gospelEn`, `gospelTa`, `officeRefEn`, `officeRefTa`, `officeEn`, `officeTa`.

Also create: `journalEntries`, `bookmarks`, `announcements`, `parishUsers`, `users` (with `userId` text field for scoping).

> **Key detail:** Use `text` type for `category`, `color`, `feastEn` etc. rather than `select` — the SDK's `select` type creation had issues.

---

## Step 4: Add Environment Variable

Create `.env` (or edit existing):

```
VITE_PB_URL=http://localhost:8090
```

In `src/pb.ts`, read it:

```ts
const PB_URL = import.meta.env.VITE_PB_URL || 'http://localhost:8090';
```

---

## Step 5: Write PocketBase Client (`src/pb.ts`)

Core functions needed:

- `initAdminAuth()` — login with superuser credentials
- `fetchPrayers()`, `fetchSaints()`, `fetchLiturgicalDays()` — get all records
- `savePrayer()`, `saveSaint()`, `saveLiturgicalDay()` — create or update
- `deletePrayer()`, `deleteSaint()`, `deleteLiturgicalDay()` — delete by PB ID
- `subscribePrayers(callback)`, `subscribeSaints(callback)`, etc. — realtime subscriptions

### Critical Lesson: Short ID Handling

PocketBase's `id` field requires **exactly 15 characters**. The app's seed data has short IDs like `morning-prayer-01` (18 chars so this would work actually) but `saint-romuald-abb` etc. These are **rejected** if passed as `id` in a `create` call.

**Solution:** Never pass custom `id` on create. Use filter-based lookup to find existing records:

```ts
// WRONG - will fail with short IDs
await pb.collection('prayers').create({ id: 'morning-prayer-01', ... });

// RIGHT - let PB generate the ID
const record = await pb.collection('prayers').create({ category: 'morning', ... });
// Use the returned PB ID (15 chars) for subsequent updates
```

For save functions, the strategy is:

```ts
async function savePrayer(prayer) {
  // If prayer.id is 15+ chars, it's a PB ID — try direct update
  if (prayer.id && prayer.id.length >= 15) {
    return await pb.collection('prayers').update(prayer.id, prayer);
  }
  // Otherwise, look up by unique fields (category + titleEn)
  try {
    const existing = await pb.collection('prayers').getFirstListItem(
      `category = "${prayer.category}" && titleEn = "${prayer.titleEn}"`
    );
    return await pb.collection('prayers').update(existing.id, prayer);
  } catch {
    // Not found — create without passing id
    const { id, ...data } = prayer;
    return await pb.collection('prayers').create(data);
  }
}
```

---

## Step 6: Update `src/App.tsx` — Fetch from PB First

Restructure the initialization:

```ts
useEffect(() => {
  const init = async () => {
    try {
      await initAdminAuth();
      const prayers = await fetchPrayers();
      if (prayers.length > 0) {
        setPrayers(prayers);
        localStorage.setItem('prayers', JSON.stringify(prayers));
        return;
      }
    } catch (e) {
      console.warn('PB unavailable, falling back to localStorage');
    }
    // Fallback
    const local = localStorage.getItem('prayers');
    if (local) setPrayers(JSON.parse(local));
    else setPrayers(SEED_PRAYERS);
  };
  init();
}, []);
```

For subscriptions, use a separate `useEffect` that subscribes after data loads:

```ts
useEffect(() => {
  const unsubs: (() => void)[] = [];
  subscribePrayers((data) => { /* update state */ });
  subscribeSaints((data) => { /* update state */ });
  // etc.
  return () => unsubs.forEach(fn => fn());
}, []);
```

**Key:** Remove any duplicate fetch calls from the subscriptions effect — the subscription callback updates state directly.

---

## Step 7: Seed Initial Data

Create `scripts/seed-v2.mjs` (Node.js ESM script):

```js
import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
await pb.collection('_superusers').authWithPassword('your-email', 'your-password');

const prayers = [ /* seed data without `id` field */ ];
for (const p of prayers) {
  await pb.collection('prayers').create(p);
}
```

Run it:

```bash
node scripts/seed-v2.mjs
```

> **Note:** Use short placeholder content for seed — full content can be added later with an update script.

---

## Step 8: Update Full Content from `seedData.ts`

Create `scripts/update-content.mjs` to populate the full prayer text:

```bash
node scripts/update-content.mjs
```

Create `scripts/update-saints-liturgical.mjs` to populate saints and liturgical days:

```bash
node scripts/update-saints-liturgical.mjs
```

---

## Step 9: Remove Firebase Files

After verifying everything works:

```bash
npm uninstall firebase
```

Delete:
- `src/firebase.ts`
- `firebase-applet-config.json`
- `firebase-blueprint.json`
- `firestore.rules`

Remove any Firebase imports from `src/App.tsx` and `src/components/AdminPanel.tsx`.

---

## Step 10: Update AdminPanel for Superuser Auth

Replace Google Sign-In with email/password login:

```tsx
// AdminPanel.tsx
const handleLogin = async () => {
  await pb.collection('_superusers').authWithPassword(email, password);
  setIsAdmin(true);
};
```

Admin panel uses `pb.authStore.isSuperuser` to check if logged in.

---

## Step 11: (Optional) Remove Google Sign-In

If no OAuth2 provider is configured in PocketBase, remove the Google Sign-In button from the admin panel.

---

## Quick Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ECONNREFUSED ::1` | Change `localhost` to `127.0.0.1` in SDK URL |
| Record not found (404) | The record may not exist — use filter-based lookup or create it |
| Custom ID rejected | PocketBase `id` must be exactly 15 chars — let PB auto-generate |
| Realtime not working | Check PB server is running; subscriptions are per-collection |
| Admin login fails | Use `_superusers` collection, not `users` |

---

## File Structure After Migration

```
├── src/
│   ├── pb.ts                  # PocketBase client (all CRUD, subscribe, auth)
│   ├── App.tsx                # Init: fetch from PB → fallback → seed
│   ├── components/
│   │   └── AdminPanel.tsx     # Superuser auth, content editing
│   └── seedData.ts            # Full seed content (prayers, saints, liturgical days)
├── scripts/
│   ├── seed-v2.mjs            # Initial seed (placeholder content)
│   ├── update-content.mjs     # Update prayers with full text
│   └── update-saints-liturgical.mjs  # Update saints & liturgical days
├── pocketbase/
│   └── pocketbase.exe         # PB server binary (v0.39.4)
├── .env.example               # VITE_PB_URL
├── BUILD_GUIDE.md             # Build/deploy instructions
└── README.md                  # Project overview with PB startup steps
```
