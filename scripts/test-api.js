// Diagnostic: simulate what the API route does
const fs = require('fs');
const { MongoClient } = require('mongodb');

const envContent = fs.readFileSync('.env', 'utf-8');
const match = envContent.match(/^MONGODB_URI=(.+)$/m);
const uri = match[1].trim().replace(/^"|"$/g, '');

// Simulate normalizeProduct
function normalizeProduct(raw) {
  const toStrArray = (val) => {
    if (Array.isArray(val)) return val.map(v => String(v));
    if (typeof val === 'string' && val.trim()) return [val.trim()];
    return [];
  };
  const sizes = toStrArray(raw.sizes);
  const benefits = toStrArray(raw.benefits);
  const directions = toStrArray(raw.directions);
  return {
    ...raw,
    id: String(raw.id ?? raw._id ?? 'unknown'),
    name: String(raw.name ?? 'Unnamed'),
    sizes: sizes.length > 0 ? sizes : ['Standard'],
    benefits: benefits.length > 0 ? benefits : ['Quality product'],
    directions: directions.length > 0 ? directions : ['Use as directed.'],
    image: (typeof raw.image === 'string' && raw.image.trim()) ? raw.image.trim() : '/images/product-placeholder.png',
    price: typeof raw.price === 'number' ? raw.price : Number(raw.price) || 0,
    active: Boolean(raw.active),
    bestSeller: Boolean(raw.bestSeller),
    featured: Boolean(raw.featured),
  };
}

async function test() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db('suraj-cleaning');

  // Step 1: Read from MongoDB like readJsonFile does
  console.log('\n=== Step 1: MongoDB read ===');
  const docs = await db.collection('products').find({}).toArray();
  console.log('Raw docs from MongoDB:', docs.length);
  const items = docs.map(({ _id, ...rest }) => rest);
  console.log('After stripping _id:', items.length);

  // Step 2: Check for duplicates
  console.log('\n=== Step 2: Duplicate check ===');
  const nameCounts = {};
  for (const item of items) {
    const n = item.name || '';
    nameCounts[n] = (nameCounts[n] || 0) + 1;
  }
  const dupes = Object.entries(nameCounts).filter(([_, c]) => c > 1);
  if (dupes.length > 0) {
    console.log('DUPLICATE NAMES FOUND:');
    dupes.forEach(([name, count]) => console.log(`  "${name}" x${count}`));
  } else {
    console.log('No duplicates found');
  }

  // Step 3: Normalize each product
  console.log('\n=== Step 3: Normalize products ===');
  let errors = 0;
  for (const item of items) {
    try {
      const normalized = normalizeProduct(item);
      if (!normalized.name || !normalized.category) {
        console.log(`MISSING FIELDS: ${normalized.name} - category: "${normalized.category}"`);
        errors++;
      }
      if (!normalized.slug) {
        console.log(`MISSING SLUG: ${normalized.name}`);
        errors++;
      }
    } catch (err) {
      console.log(`NORMALIZE ERROR for ${item.name}: ${err.message}`);
      errors++;
    }
  }
  console.log(`Products with issues: ${errors}/${items.length}`);

  // Step 4: Count active
  console.log('\n=== Step 4: Active count ===');
  const active = items.filter(p => p.active !== false);
  console.log('Active (active !== false):', active.length);
  const activeStrict = items.filter(p => p.active === true);
  console.log('Active (active === true):', activeStrict.length);
  const undefinedActive = items.filter(p => p.active === undefined);
  console.log('Active undefined:', undefinedActive.length, '- names:', undefinedActive.map(p => p.name).join(', '));

  await client.close();
}

test().catch(err => console.error('Fatal:', err.message));
