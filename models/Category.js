const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên danh mục là bắt buộc'],
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});

// Note: unique: true tự động tạo index, không cần thêm index({ name: 1 })

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
