const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

/**
 * @route   GET /api/ingredients/search
 * @desc    Tìm kiếm nguyên liệu theo keyword (name, type, description)
 * @access  Public
 * @query   keyword, type, isAvailable, minPrice, maxPrice, season, sortBy, sortOrder, page, limit
 * 
 * Ví dụ: GET /api/ingredients/search?keyword=thịt&type=Thịt&minPrice=50000&maxPrice=200000&sortBy=pricePerUnit&sortOrder=asc&page=1&limit=10
 */
router.get('/search', async (req, res) => {
  try {
    const { 
      keyword = '', 
      type,
      isAvailable,
      minPrice,
      maxPrice,
      season,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Validate page và limit
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    
    // Build query filter
    const filter = {};
    
    // Tìm kiếm theo keyword (regex không phân biệt hoa thường)
    if (keyword && keyword.trim()) {
      const keywordRegex = new RegExp(keyword.trim(), 'i');
      filter.$or = [
        { name: keywordRegex },
        { type: keywordRegex },
        { description: keywordRegex }
      ];
    }
    
    // Filter theo type
    if (type) {
      const validTypes = ['Rau củ', 'Thịt', 'Hải sản', 'Gia vị', 'Ngũ cốc', 'Trái cây', 'Sữa & Trứng', 'Khác'];
      if (validTypes.includes(type)) {
        filter.type = type;
      }
    }
    
    // Filter theo isAvailable
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    // Filter theo giá
    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = parseFloat(maxPrice);
    }

    // Filter theo season
    if (season) {
      filter.season = season;
    }

    // Sort options
    const validSortFields = ['name', 'type', 'pricePerUnit', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

    // Tính skip
    const skip = (pageNum - 1) * limitNum;

    // Query database
    const ingredients = await Ingredient.find(filter)
      .select('name type description nutrition unit pricePerUnit image isAvailable season')
      .skip(skip)
      .limit(limitNum)
      .sort(sortOptions);

    // Đếm tổng số documents
    const totalItems = await Ingredient.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      success: true,
      filters: {
        keyword: keyword || null,
        type: type || null,
        isAvailable: isAvailable || null,
        priceRange: { min: minPrice || null, max: maxPrice || null },
        season: season || null,
        sortBy: sortField,
        sortOrder
      },
      page: pageNum,
      totalPages,
      totalItems,
      data: ingredients
    });

  } catch (error) {
    console.error('Error searching ingredients:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm nguyên liệu',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/ingredients
 * @desc    Lấy danh sách tất cả nguyên liệu với phân trang
 * @access  Public
 * @query   page, limit, type
 */
router.get('/', async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    
    const filter = {};
    if (type) {
      filter.type = type;
    }
    
    const skip = (pageNum - 1) * limitNum;

    const ingredients = await Ingredient.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ type: 1, name: 1 });

    const totalItems = await Ingredient.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      success: true,
      page: pageNum,
      totalPages,
      totalItems,
      data: ingredients
    });

  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách nguyên liệu',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/ingredients/:id
 * @desc    Lấy chi tiết một nguyên liệu
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nguyên liệu'
      });
    }

    res.json({
      success: true,
      data: ingredient
    });

  } catch (error) {
    console.error('Error fetching ingredient:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin nguyên liệu',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/ingredients/types/list
 * @desc    Lấy danh sách các loại nguyên liệu
 * @access  Public
 */
router.get('/types/list', async (req, res) => {
  try {
    const types = ['Rau củ', 'Thịt', 'Hải sản', 'Gia vị', 'Ngũ cốc', 'Trái cây', 'Sữa & Trứng', 'Khác'];
    
    // Đếm số lượng ingredient cho mỗi type
    const typesWithCount = await Promise.all(
      types.map(async (type) => {
        const count = await Ingredient.countDocuments({ type });
        return { type, count };
      })
    );

    res.json({
      success: true,
      data: typesWithCount
    });

  } catch (error) {
    console.error('Error fetching ingredient types:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách loại nguyên liệu',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/ingredients/stats/summary
 * @desc    Lấy thống kê tổng quan về nguyên liệu
 * @access  Public
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Ingredient.aggregate([
      {
        $facet: {
          // Thống kê theo loại
          byType: [
            { $group: { _id: '$type', count: { $sum: 1 }, avgPrice: { $avg: '$pricePerUnit' } } },
            { $sort: { count: -1 } }
          ],
          // Thống kê theo mùa
          bySeason: [
            { $unwind: { path: '$season', preserveNullAndEmptyArrays: true } },
            { $group: { _id: '$season', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } }
          ],
          // Thống kê giá
          priceStats: [
            {
              $group: {
                _id: null,
                avgPrice: { $avg: '$pricePerUnit' },
                minPrice: { $min: '$pricePerUnit' },
                maxPrice: { $max: '$pricePerUnit' },
                totalIngredients: { $sum: 1 },
                availableCount: { $sum: { $cond: ['$isAvailable', 1, 0] } }
              }
            }
          ],
          // Top 5 nguyên liệu đắt nhất
          topExpensive: [
            { $sort: { pricePerUnit: -1 } },
            { $limit: 5 },
            { $project: { name: 1, type: 1, pricePerUnit: 1, unit: 1 } }
          ],
          // Top 5 nguyên liệu rẻ nhất
          topCheap: [
            { $sort: { pricePerUnit: 1 } },
            { $limit: 5 },
            { $project: { name: 1, type: 1, pricePerUnit: 1, unit: 1 } }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byType: stats[0].byType,
        bySeason: stats[0].bySeason,
        priceStats: stats[0].priceStats[0],
        topExpensive: stats[0].topExpensive,
        topCheap: stats[0].topCheap,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Error fetching ingredient stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê nguyên liệu',
      error: error.message
    });
  }
});

module.exports = router;
