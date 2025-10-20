const mongoose = require('mongoose');

/**
 * Schema cho Nguyên liệu (Ingredient)
 * Lưu trữ thông tin về các nguyên liệu dùng trong món ăn
 */
const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên nguyên liệu là bắt buộc'],
    trim: true,
    index: true // Index cho tìm kiếm nhanh
  },
  type: {
    type: String,
    enum: ['Rau củ', 'Thịt', 'Hải sản', 'Gia vị', 'Ngũ cốc', 'Trái cây', 'Sữa & Trứng', 'Khác'],
    default: 'Khác',
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  nutrition: {
    calories: { type: Number }, // kcal/100g
    protein: { type: Number },  // g/100g
    fat: { type: Number },      // g/100g
    carbs: { type: Number },    // g/100g
    fiber: { type: Number }     // g/100g
  },
  unit: {
    type: String,
    default: 'g' // g, ml, quả, củ, cái, etc.
  },
  pricePerUnit: {
    type: Number, // Giá trung bình
    default: 0
  },
  image: {
    type: String,
    trim: true
  },
  season: {
    type: [String], // ['Xuân', 'Hạ', 'Thu', 'Đông']
    default: []
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Text index cho full-text search
ingredientSchema.index({ 
  name: 'text', 
  description: 'text',
  type: 'text'
});

// Compound index cho query phức tạp
ingredientSchema.index({ type: 1, isAvailable: 1 });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
