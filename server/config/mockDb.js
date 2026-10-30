// Mock in-memory database for local development without MongoDB
class MockDatabase {
  constructor() {
    this.photos = [
      {
        _id: '1',
        title: 'Mountain Peak at Sunrise',
        description: 'A breathtaking view of snow-capped mountains at sunrise',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400',
        category: 'Nature',
        tags: ['mountain', 'sunrise', 'nature'],
        photographer: 'John Doe',
        isFavorite: false,
        views: 245,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        _id: '2',
        title: 'Urban Architecture',
        description: 'Modern skyscrapers and city lights',
        imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=400',
        category: 'Architecture',
        tags: ['city', 'modern', 'architecture'],
        photographer: 'Jane Smith',
        isFavorite: false,
        views: 182,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10'),
      },
      {
        _id: '3',
        title: 'Wild Lion Portrait',
        description: 'Close-up portrait of a majestic lion in the savanna',
        imageUrl: 'https://images.unsplash.com/photo-1587471080563-430f63602d4b?w=500&h=400',
        category: 'Animals',
        tags: ['lion', 'wildlife', 'africa'],
        photographer: 'Wildlife Photographer',
        isFavorite: true,
        views: 512,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05'),
      },
      {
        _id: '4',
        title: 'Delicious Pizza',
        description: 'Artisan pizza with fresh ingredients',
        imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=400',
        category: 'Food',
        tags: ['food', 'pizza', 'italian'],
        photographer: 'Food Blogger',
        isFavorite: false,
        views: 398,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        _id: '5',
        title: 'Beach Sunset',
        description: 'Golden hour at a tropical beach',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=400',
        category: 'Travel',
        tags: ['beach', 'sunset', 'travel'],
        photographer: 'Travel Enthusiast',
        isFavorite: false,
        views: 678,
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-02-28'),
      },
      {
        _id: '6',
        title: 'Street Portrait',
        description: 'Candid portrait of a person on the street',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400',
        category: 'People',
        tags: ['people', 'portrait', 'street'],
        photographer: 'Street Photographer',
        isFavorite: false,
        views: 234,
        createdAt: new Date('2024-03-12'),
        updatedAt: new Date('2024-03-12'),
      },
    ];
    this.nextId = 7;
    this.users = [];
  }

  getAll(filter = {}) {
    let results = this.photos;

    // Filter by category
    if (filter.category) {
      results = results.filter((p) => p.category === filter.category);
    }

    // Filter by favorites
    if (filter.isFavorite) {
      results = results.filter((p) => p.isFavorite === true);
    }

    // Search functionality
    if (filter.$or) {
      results = results.filter((photo) => {
        return filter.$or.some((condition) => {
          for (let key in condition) {
            const regex = condition[key];
            if (regex instanceof RegExp) {
              if (key === 'tags') {
                if (photo.tags.some((tag) => regex.test(tag))) return true;
              } else {
                if (regex.test(photo[key] || '')) return true;
              }
            }
          }
          return false;
        });
      });
    }

    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getById(id) {
    return this.photos.find((p) => p._id === id);
  }

  create(data) {
    const photo = {
      _id: String(this.nextId++),
      ...data,
      isFavorite: false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.photos.push(photo);
    return photo;
  }

  update(id, data) {
    const index = this.photos.findIndex((p) => p._id === id);
    if (index === -1) return null;
    this.photos[index] = { ...this.photos[index], ...data, updatedAt: new Date() };
    return this.photos[index];
  }

  delete(id) {
    const index = this.photos.findIndex((p) => p._id === id);
    if (index === -1) return false;
    this.photos.splice(index, 1);
    return true;
  }

  incrementViews(id) {
    const photo = this.getById(id);
    if (photo) {
      photo.views = (photo.views || 0) + 1;
      photo.updatedAt = new Date();
    }
    return photo;
  }

  getCategories() {
    return [...new Set(this.photos.map((p) => p.category))];
  }

  findUserByEmail(email) {
    return this.users.find((user) => user.email === email) || null;
  }

  createUser(data) {
    const user = { _id: String(this.users.length + 1), ...data, createdAt: new Date() };
    this.users.push(user);
    return user;
  }

  updateUser(email, data) {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    Object.assign(user, data);
    return user;
  }
}

module.exports = new MockDatabase();
