const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên món ăn là bắt buộc'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  portion: {
    type: String,
    trim: true
  },
  time: {
    type: String,
    trim: true
  },
  ingredients: {
    type: String,
    trim: true
  },
  steps: {
    type: String,
    trim: true
  },
  calories: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Dễ', 'Trung bình', 'Khó', ''],
    default: ''
  },
  image: {
    type: String,
    trim: true
  },
  preprocess: {
    type: String,
    trim: true
  },
  serving: {
    type: String,
    trim: true
  },
  page: {
    type: Number
  }
}, {
  timestamps: true
});

// Index để tối ưu query
foodSchema.index({ name: 1 });
foodSchema.index({ categories: 1 });
foodSchema.index({ difficulty: 1 });

// Text index cho full-text search
foodSchema.index({ 
  name: 'text', 
  description: 'text',
  ingredients: 'text'
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
