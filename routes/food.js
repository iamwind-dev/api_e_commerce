const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const Category = require('../models/Category');

/**
 * @route   GET /api/foods
 * @desc    Lấy danh sách món ăn với phân trang và filter theo category
 * @access  Public
 * @query   category (ObjectId), page (default 1), limit (default 10)
 */
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    // Validate page và limit
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page và limit phải lớn hơn 0'
      });
    }

    // Build query filter
    const filter = {};
    if (category) {
      filter.categories = category;
    }

    // Tính skip
    const skip = (pageNum - 1) * limitNum;

    // Query database
    const foods = await Food.find(filter)
      .populate('categories', 'name')
      .select('name categories time difficulty image calories portion link')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Đếm tổng số documents
    const totalItems = await Food.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      success: true,
      page: pageNum,
      totalPages,
      totalItems,
      data: foods
    });

  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách món ăn',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/foods/:id
 * @desc    Lấy chi tiết một món ăn
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate('categories', 'name');

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món ăn'
      });
    }

    res.json({
      success: true,
      data: food
    });

  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin món ăn',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/foods/categories
 * @desc    Lấy danh sách tất cả các danh mục
 * @access  Public
 */
router.get('/list/categories', async (req, res) => {
  try {
    const categories = await Category.find()
      .select('name')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách danh mục',
      error: error.message
    });
  }
});

module.exports = router;
