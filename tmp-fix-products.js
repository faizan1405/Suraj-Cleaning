const { MongoClient } = require('mongodb');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf-8');
const match = envContent.match(/^MONGODB_URI=(.+)$/m);
const uri = match[1].trim().replace(/^"|"$/g, '');

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

client.connect().then(async () => {
  const db = client.db('suraj-cleaning');
  const products = await db.collection('products').find({}).sort({ name: 1 }).toArray();

  // Build a slug uniqueness map to fix collisions
  const slugCounter = {};
  products.forEach(p => {
    const s = p.slug || '';
    slugCounter[s] = (slugCounter[s] || 0) + 1;
  });

  const benefitTemplates = {
    bathroom: [
      'Kills 99.9% of germs and bacteria',
      'Removes tough stains and limescale',
      'Leaves surfaces sparkling clean and fresh',
    ],
    kitchen: [
      'Cuts through tough grease and oil',
      'Removes food stains effortlessly',
      'Leaves dishes and surfaces spotless',
    ],
    laundry: [
      'Deep cleaning action for all fabric types',
      'Removes tough stains and odours',
      'Leaves clothes soft and fragrant',
    ],
    floor: [
      'Kills 99.9% germs and bacteria',
      'Removes dirt and grime effectively',
      'Leaves floors shiny and pleasantly fragrant',
    ],
    personal: [
      'Gentle on skin, tough on germs',
      'Leaves hands soft and fresh',
      'Available in delightful fragrances',
    ],
  };

  const productBenefitOverrides = {
    phenyl: ['Powerful disinfectant action', 'Removes tough stains and dirt', 'Leaves floors germ-free and fragrant'],
    glass: ['Streak-free shine on all glass surfaces', 'Removes fingerprints and smudges', 'Fast-drying, no residue'],
    acid: ['Removes tough rust, stains, and deposits', 'Powerful acid-based cleaning formula', 'Ideal for toilets, sinks, and tiles'],
    toilet: ['Powerful rim and bowl cleaning action', 'Kills 99.9% of germs and bacteria', 'Removes tough stains and bad odours'],
    freshener: ['Long-lasting fragrance for hours', 'Eliminates bad odours instantly', 'Creates a pleasant atmosphere anywhere'],
    combo: ['Complete home cleaning solution', 'Value pack with multiple essential products', 'Save more with this all-in-one pack'],
  };

  let updatedCount = 0;

  for (const p of products) {
    const updates = {};
    let changed = false;
    const name = (p.name || '').toLowerCase();

    // --- Fix slug ---
    let baseSlug = p.slug || '';
    // Clean up bad slugs
    if (!baseSlug || baseSlug.includes('//') || baseSlug.endsWith('-') || slugCounter[baseSlug] > 1) {
      baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    // Ensure uniqueness
    const allSlugs = new Set(products.map(x => x.slug));
    let uniqueSlug = baseSlug;
    if (allSlugs.has(uniqueSlug) && p.slug !== uniqueSlug) {
      uniqueSlug = baseSlug + '-' + p._id.toString().slice(-6);
    }
    if (uniqueSlug && uniqueSlug !== p.slug) {
      updates.slug = uniqueSlug;
      changed = true;
    }

    // --- Fix sizes ---
    const existingSizes = Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === 'string' ? [p.sizes] : []);
    if (existingSizes.length === 0 || (existingSizes.length === 1 && existingSizes[0] === 'Standard')) {
      // Try to extract from name
      const extracted = new Set();
      const mlMatch = name.matchAll(/\b(\d+)\s*ml\b/g);
      for (const m of mlMatch) extracted.add(m[1] + 'ml');
      const lMatch = name.matchAll(/\b(\d+(?:\.\d+)?)\s*l\b/g);
      for (const m of lMatch) extracted.add(parseFloat(m[1]) + 'L');

      if (extracted.size > 0) {
        updates.sizes = [...extracted];
      } else {
        // Category-based default
        const cat = (p.category || '').toLowerCase();
        if (cat.includes('floor')) updates.sizes = ['500ml', '1L', '5L'];
        else if (cat.includes('bathroom')) updates.sizes = ['250ml', '500ml'];
        else if (cat.includes('kitchen')) updates.sizes = ['500ml', '1L'];
        else if (cat.includes('laundry')) updates.sizes = ['1L', '2L', '5L'];
        else if (cat.includes('personal')) updates.sizes = ['250ml', '500ml'];
      }
      changed = true;
    }

    // --- Fix benefits ---
    const existingBenefits = Array.isArray(p.benefits) ? p.benefits : [];
    if (existingBenefits.length === 0 || (existingBenefits.length === 1 && existingBenefits[0] === 'Quality product')) {
      const cat = (p.category || '').toLowerCase();
      let benefits = benefitTemplates.personal;

      if (cat.includes('bathroom')) benefits = benefitTemplates.bathroom;
      else if (cat.includes('kitchen')) benefits = benefitTemplates.kitchen;
      else if (cat.includes('laundry')) benefits = benefitTemplates.laundry;
      else if (cat.includes('floor')) benefits = benefitTemplates.floor;

      // Product-specific overrides
      for (const [keyword, template] of Object.entries(productBenefitOverrides)) {
        if (name.includes(keyword)) {
          benefits = template;
          break;
        }
      }

      updates.benefits = benefits;
      changed = true;
    }

    if (changed) {
      await db.collection('products').updateOne({ _id: p._id }, { $set: updates });
      console.log(`Updated: ${p.name}`);
      if (updates.slug) console.log(`  slug → ${updates.slug}`);
      if (updates.sizes) console.log(`  sizes → ${JSON.stringify(updates.sizes)}`);
      if (updates.benefits) console.log(`  benefits → ${updates.benefits.length} items`);
      updatedCount++;
    }
  }

  console.log(`\nUpdated ${updatedCount} products`);

  // --- Verify ---
  const dupSlugs = await db.collection('products').aggregate([
    { $group: { _id: '$slug', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]).toArray();
  console.log(`Duplicate slugs: ${dupSlugs.length === 0 ? 'None ✓' : dupSlugs.map(d => d._id).join(', ')}`);

  const noBenefits = await db.collection('products').countDocuments({
    $or: [{ benefits: { $exists: false } }, { benefits: { $size: 0 } }]
  });
  console.log(`Products missing benefits: ${noBenefits}`);

  const noSizes = await db.collection('products').countDocuments({
    $or: [{ sizes: { $exists: false } }, { sizes: { $size: 0 } }]
  });
  console.log(`Products missing sizes: ${noSizes}`);

  await client.close();
  console.log('\nDone!');
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
