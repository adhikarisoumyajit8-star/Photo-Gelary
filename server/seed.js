const mongoose = require('mongoose');
const Photo = require('./models/Photo');
const connectDB = require('./config/db');

// ──────────────────────────────────────────────
// 24 Sample Photos from Unsplash across 6 categories
// ──────────────────────────────────────────────
const samplePhotos = [
  // ─── Nature (4) ───
  {
    title: 'Golden Hour Sunset',
    description: 'A breathtaking sunset over rolling hills with vibrant orange and purple hues painting the sky.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    category: 'Nature',
    tags: ['sunset', 'landscape', 'golden hour', 'hills'],
    photographer: 'Bailey Zindel',
    isFavorite: true,
  },
  {
    title: 'Misty Mountain Forest',
    description: 'Dense forest shrouded in ethereal morning mist with sunbeams breaking through the canopy.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    category: 'Nature',
    tags: ['forest', 'mist', 'trees', 'morning'],
    photographer: 'Luca Bravo',
  },
  {
    title: 'Turquoise Lake Reflection',
    description: 'Crystal clear turquoise lake reflecting snow-capped mountains under a cloudless sky.',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
    category: 'Nature',
    tags: ['lake', 'mountains', 'reflection', 'water'],
    photographer: 'Mads Schmidt',
  },
  {
    title: 'Lavender Fields Forever',
    description: 'Endless rows of blooming lavender stretching toward the horizon at golden hour.',
    imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&q=80',
    category: 'Nature',
    tags: ['lavender', 'flowers', 'fields', 'purple'],
    photographer: 'Léonard Cotte',
  },

  // ─── Architecture (4) ───
  {
    title: 'Modern Glass Tower',
    description: 'Sleek glass skyscraper reflecting clouds and city skyline in its mirrored facade.',
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    category: 'Architecture',
    tags: ['skyscraper', 'modern', 'glass', 'urban'],
    photographer: 'Jason Dent',
  },
  {
    title: 'Ancient Roman Colosseum',
    description: 'The iconic Colosseum bathed in warm evening light showcasing centuries of history.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    category: 'Architecture',
    tags: ['rome', 'colosseum', 'ancient', 'history'],
    photographer: 'Spencer Davis',
    isFavorite: true,
  },
  {
    title: 'Spiral Staircase',
    description: 'Mesmerizing spiral staircase viewed from above creating a perfect geometric pattern.',
    imageUrl: 'https://images.unsplash.com/photo-1553696647-7250e0e0e200?w=800&q=80',
    category: 'Architecture',
    tags: ['spiral', 'stairs', 'geometry', 'interior'],
    photographer: 'Tine Ivanič',
  },
  {
    title: 'Japanese Temple Gate',
    description: 'Traditional torii gate framing a serene path through a Japanese garden in autumn.',
    imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&q=80',
    category: 'Architecture',
    tags: ['japan', 'temple', 'torii', 'traditional'],
    photographer: 'Su San Lee',
  },

  // ─── People (4) ───
  {
    title: 'Street Musician',
    description: 'A passionate street musician playing guitar on a cobblestone street at dusk.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    category: 'People',
    tags: ['music', 'street', 'guitar', 'performance'],
    photographer: 'Jefferson Santos',
  },
  {
    title: 'Morning Coffee Ritual',
    description: 'Cozy scene of hands cradling a warm cup of artisan coffee in soft morning light.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    category: 'People',
    tags: ['coffee', 'morning', 'cozy', 'hands'],
    photographer: 'Nathan Dumlao',
  },
  {
    title: 'Artist at Work',
    description: 'An artist deep in concentration painting on a large canvas in a sunlit studio.',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
    category: 'People',
    tags: ['art', 'painting', 'studio', 'creative'],
    photographer: 'Khara Woods',
    isFavorite: true,
  },
  {
    title: 'Festival Celebration',
    description: 'Joyful festival-goers throwing colored powder during a vibrant celebration.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    category: 'People',
    tags: ['festival', 'celebration', 'colors', 'joy'],
    photographer: 'Aditya Chinchure',
  },

  // ─── Animals (4) ───
  {
    title: 'Majestic Bald Eagle',
    description: 'A bald eagle in flight with wings fully spread against a clear blue sky.',
    imageUrl: 'https://images.unsplash.com/photo-1611689342806-0f0e1b1b1b0a?w=800&q=80',
    category: 'Animals',
    tags: ['eagle', 'bird', 'flight', 'wildlife'],
    photographer: 'Ingo Doerrie',
  },
  {
    title: 'Curious Red Fox',
    description: 'A beautiful red fox peering curiously through autumn foliage with bright amber eyes.',
    imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80',
    category: 'Animals',
    tags: ['fox', 'wildlife', 'autumn', 'curious'],
    photographer: 'Ray Hennessy',
    isFavorite: true,
  },
  {
    title: 'Underwater Sea Turtle',
    description: 'A graceful sea turtle gliding through crystal clear tropical waters.',
    imageUrl: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=800&q=80',
    category: 'Animals',
    tags: ['turtle', 'ocean', 'underwater', 'marine'],
    photographer: 'Wexor Tmg',
  },
  {
    title: 'Snow Leopard Portrait',
    description: 'An elusive snow leopard resting on a rocky ledge with piercing blue-green eyes.',
    imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800&q=80',
    category: 'Animals',
    tags: ['leopard', 'snow', 'wildlife', 'portrait'],
    photographer: 'Geranimo',
  },

  // ─── Travel (4) ───
  {
    title: 'Santorini Blue Domes',
    description: 'Iconic blue-domed churches of Santorini overlooking the sparkling Aegean Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    category: 'Travel',
    tags: ['santorini', 'greece', 'blue', 'mediterranean'],
    photographer: 'Tom Grimbert',
    isFavorite: true,
  },
  {
    title: 'Northern Lights Display',
    description: 'Spectacular aurora borealis dancing across the Arctic sky in shades of green and purple.',
    imageUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80',
    category: 'Travel',
    tags: ['aurora', 'northern lights', 'arctic', 'night'],
    photographer: 'Jonatan Pie',
  },
  {
    title: 'Venetian Canal Gondola',
    description: 'A traditional gondola navigating the enchanting canals of Venice at sunset.',
    imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=80',
    category: 'Travel',
    tags: ['venice', 'gondola', 'canal', 'italy'],
    photographer: 'Kit Suman',
  },
  {
    title: 'Machu Picchu Ruins',
    description: 'The ancient Incan citadel of Machu Picchu emerging from morning clouds.',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
    category: 'Travel',
    tags: ['peru', 'machu picchu', 'ruins', 'ancient'],
    photographer: 'Willian Justen',
  },

  // ─── Food (4) ───
  {
    title: 'Artisan Berry Tart',
    description: 'A beautifully crafted berry tart topped with fresh raspberries, blueberries, and mint.',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    category: 'Food',
    tags: ['dessert', 'tart', 'berries', 'baking'],
    photographer: 'Brooke Lark',
  },
  {
    title: 'Sushi Platter Deluxe',
    description: 'An exquisite platter of fresh sushi and sashimi arranged with artistic precision.',
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
    category: 'Food',
    tags: ['sushi', 'japanese', 'seafood', 'gourmet'],
    photographer: 'Mahmoud Fawzy',
    isFavorite: true,
  },
  {
    title: 'Rustic Sourdough Bread',
    description: 'Freshly baked sourdough bread with a perfectly golden crust on a rustic wooden board.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    category: 'Food',
    tags: ['bread', 'sourdough', 'baking', 'rustic'],
    photographer: 'Wesual Click',
  },
  {
    title: 'Colorful Smoothie Bowls',
    description: 'Vibrant acai smoothie bowls topped with tropical fruits, granola, and coconut flakes.',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',
    category: 'Food',
    tags: ['smoothie', 'acai', 'healthy', 'breakfast'],
    photographer: 'Toa Heftiba',
  },
];

// ──────────────────────────────────────────────
// Seed the database
// ──────────────────────────────────────────────
const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing photos
    await Photo.deleteMany({});
    console.log('🗑️  Cleared existing photos');

    // Insert sample photos
    const inserted = await Photo.insertMany(samplePhotos);
    console.log(`🌱 Seeded ${inserted.length} photos across 6 categories`);

    // Print summary
    const categories = await Photo.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    console.log('\n📊 Category breakdown:');
    categories.forEach((c) => console.log(`   ${c._id}: ${c.count} photos`));

    const favCount = await Photo.countDocuments({ isFavorite: true });
    console.log(`\n⭐ ${favCount} photos marked as favorites`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
