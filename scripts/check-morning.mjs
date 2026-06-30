import PocketBase from 'pocketbase';
const pb = new PocketBase('http://localhost:8090');
const prayers = await pb.collection('prayers').getFullList({
  filter: 'category = "morning"',
  requestKey: 'q'
});
for (const p of prayers) {
  console.log('ID:', p.id);
  console.log('Title:', p.titleEn);
  console.log('Content length:', p.contentEn.length, 'chars');
  console.log('First 200 chars:', p.contentEn.substring(0, 200));
  console.log('---');
}
