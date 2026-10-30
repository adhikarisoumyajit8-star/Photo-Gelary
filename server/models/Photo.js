const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Photo title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Nature', 'Architecture', 'People', 'Animals', 'Travel', 'Food'],
    },
    tags: {
      type: [String],
      default: [],
    },
    photographer: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for efficient querying
photoSchema.index({ category: 1 });
photoSchema.index({ isFavorite: 1 });
photoSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Photo', photoSchema);
