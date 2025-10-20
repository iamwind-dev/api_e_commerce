const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Food = require('../models/Food');

/**
 * @route   GET /api/categories/search
 * @desc    Tìm kiếm danh mục theo keyword
 * @access  Public
 * @query   keyword, page, limit
 * 
 * Ví dụ: GET /api/categories/search?keyword=ăn vặt&page=1&limit=10
 */
router.get('/search', async (req, res) => {
  try {
    const { 
      keyword = '', 
      page = 1, 
      limit = 20 
    } = req.query;
    
    // Validate page và limit
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    
    // Build query filter
    const filter = {};
    
    // Tìm kiếm theo keyword (regex không phân biệt hoa thường)
    if (keyword && keyword.trim()) {
      const keywordRegex = new RegExp(keyword.trim(), 'i');
      filter.name = keywordRegex;
    }

    // Tính skip
    const skip = (pageNum - 1) * limitNum;

    // Query database
    const categories = await Category.find(filter)
      .select('name')
      .skip(skip)
      .limit(limitNum)
      .sort({ name: 1 });

    // Đếm số lượng món ăn cho mỗi category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const foodCount = await Food.countDocuments({ 
          categories: category._id 
        });
        
        return {
          _id: category._id,
          name: category.name,
          foodCount: foodCount,
          createdAt: category.createdAt
        };
      })
    );

    // Đếm tổng số documents
    const totalItems = await Category.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      success: true,
      keyword: keyword || null,
      page: pageNum,
      totalPages,
      totalItems,
      data: categoriesWithCount
    });

  } catch (error) {
    console.error('Error searching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm danh mục',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/categories
 * @desc    Lấy danh sách tất cả các danh mục với số lượng món ăn
 * @access  Public
 * @query   page, limit
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    
    const skip = (pageNum - 1) * limitNum;

    // Lấy tất cả categories
    const categories = await Category.find()
      .select('name')
      .skip(skip)
      .limit(limitNum)
      .sort({ name: 1 });

    // Đếm số lượng món ăn cho mỗi category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const foodCount = await Food.countDocuments({ 
          categories: category._id 
        });
        
        return {
          _id: category._id,
          name: category.name,
          foodCount: foodCount,
          createdAt: category.createdAt
        };
      })
    );

    const totalItems = await Category.countDocuments();
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      success: true,
      page: pageNum,
      totalPages,
      totalItems,
      data: categoriesWithCount
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

/**
 * @route   GET /api/categories/:id
 * @desc    Lấy chi tiết một danh mục và danh sách món ăn trong danh mục
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    // Lấy danh sách món ăn trong danh mục
    const foods = await Food.find({ categories: category._id })
      .select('name image difficulty time calories')
      .limit(20)
      .sort({ createdAt: -1 });

    const totalFoods = await Food.countDocuments({ categories: category._id });

    res.json({
      success: true,
      data: {
        _id: category._id,
        name: category.name,
        foodCount: totalFoods,
        foods: foods,
        createdAt: category.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin danh mục',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/categories/:id/foods
 * @desc    Lấy danh sách món ăn trong danh mục với phân trang
 * @access  Public
 * @query   page, limit, difficulty
 */
router.get('/:id/foods', async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty } = req.query;
    
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    
    // Kiểm tra category tồn tại
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    const filter = { categories: req.params.id };
    
    // Filter theo difficulty nếu có
    if (difficulty && ['Dễ', 'Trung bình', 'Khó'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }
    
    const skip = (pageNum - 1) * limitNum;

    const foods = await Food.find(filter)
      .populate('categories', 'name')
      .select('name description image difficulty time calories ingredients')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const totalItems = await Food.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      success: true,
      category: {
        _id: category._id,
        name: category.name
      },
      page: pageNum,
      totalPages,
      totalItems,
      data: foods
    });

  } catch (error) {
    console.error('Error fetching foods in category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách món ăn',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/categories/stats/summary
 * @desc    Lấy thống kê tổng quan các danh mục
 * @access  Public
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const categories = await Category.find().select('name');
    
    const stats = await Promise.all(
      categories.map(async (category) => {
        const totalFoods = await Food.countDocuments({ 
          categories: category._id 
        });
        
        const easyFoods = await Food.countDocuments({ 
          categories: category._id,
          difficulty: 'Dễ'
        });
        
        const mediumFoods = await Food.countDocuments({ 
          categories: category._id,
          difficulty: 'Trung bình'
        });
        
        const hardFoods = await Food.countDocuments({ 
          categories: category._id,
          difficulty: 'Khó'
        });

        return {
          _id: category._id,
          name: category.name,
          totalFoods,
          byDifficulty: {
            easy: easyFoods,
            medium: mediumFoods,
            hard: hardFoods
          }
        };
      })
    );

    // Sắp xếp theo số lượng món ăn giảm dần
    stats.sort((a, b) => b.totalFoods - a.totalFoods);

    res.json({
      success: true,
      totalCategories: categories.length,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê danh mục',
      error: error.message
    });
  }
});

module.exports = router;
