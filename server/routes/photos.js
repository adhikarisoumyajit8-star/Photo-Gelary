const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mockDb = require('../config/mockDb');
const { requireAdmin } = require('../middleware/auth');

let Photo = null;

// Try to load the Photo model if mongoose is connected
try {
  Photo = require('../models/Photo');
} catch (e) {
  // Photo model not available, will use mock DB
}

// Helper to check if MongoDB is connected
const isMongoDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

// ──────────────────────────────────────────────
// GET /api/photos/categories/list
// Returns distinct category values
// ──────────────────────────────────────────────
router.get('/categories/list', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const categories = await Photo.distinct('category');
      res.json(categories);
    } else {
      const categories = mockDb.getCategories();
      res.json(categories);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ──────────────────────────────────────────────
// GET /api/photos
// Query params: ?category=Nature&search=sunset&favorites=true
// ──────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, search, favorites } = req.query;

    if (isMongoDBConnected()) {
      // MongoDB query
      let filter = {};

      if (category && category !== 'All') {
        filter.category = category;
      }

      if (favorites === 'true') {
        filter.isFavorite = true;
      }

      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { photographer: searchRegex },
        ];
      }

      const photos = await Photo.find(filter).sort({ createdAt: -1 });
      res.json(photos);
    } else {
      // Mock DB query
      let filter = {};

      if (category && category !== 'All') {
        filter.category = category;
      }

      if (favorites === 'true') {
        filter.isFavorite = true;
      }

      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { photographer: searchRegex },
        ];
      }

      const photos = mockDb.getAll(filter);
      res.json(photos);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ──────────────────────────────────────────────
// GET /api/photos/:id
// Returns a single photo and increments view count
// ──────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const photo = await Photo.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
      );

      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      res.json(photo);
    } else {
      const photo = mockDb.incrementViews(req.params.id);

      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      res.json(photo);
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid photo ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ──────────────────────────────────────────────
// POST /api/photos
// Create a new photo entry
// ──────────────────────────────────────────────
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl, category, tags, photographer } = req.body;

    if (isMongoDBConnected()) {
      const photo = new Photo({
        title,
        description,
        imageUrl,
        category,
        tags: tags || [],
        photographer: photographer || 'Unknown',
      });

      const savedPhoto = await photo.save();
      res.status(201).json(savedPhoto);
    } else {
      const photo = mockDb.create({
        title,
        description,
        imageUrl,
        category,
        tags: tags || [],
        photographer: photographer || 'Unknown',
      });

      res.status(201).json(photo);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ──────────────────────────────────────────────
// PUT /api/photos/:id
// Update a photo
// ──────────────────────────────────────────────
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      res.json(photo);
    } else {
      const photo = mockDb.update(req.params.id, req.body);

      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      res.json(photo);
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ──────────────────────────────────────────────
// PATCH /api/photos/:id/favorite
// Toggle the isFavorite field
// ──────────────────────────────────────────────
router.patch('/:id/favorite', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const photo = await Photo.findById(req.params.id);

      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      photo.isFavorite = !photo.isFavorite;
      await photo.save();

      res.json(photo);
    } else {
      const photo = mockDb.getById(req.params.id);

      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      photo.isFavorite = !photo.isFavorite;
      photo.updatedAt = new Date();

      res.json(photo);
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid photo ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ──────────────────────────────────────────────
// DELETE /api/photos/:id
// Delete a photo
// ──────────────────────────────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const photo = await Photo.findByIdAndDelete(req.params.id);

      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      res.json({ message: 'Photo deleted successfully', id: req.params.id });
    } else {
      const deleted = mockDb.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      res.json({ message: 'Photo deleted successfully', id: req.params.id });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid photo ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
