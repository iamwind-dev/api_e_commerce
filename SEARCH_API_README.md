# 🔍 Search API Documentation

### Foods Search

#### `GET /api/foods/search`

Tìm kiếm món ăn theo keyword, category, difficulty

**Query Parameters:**

- `keyword` (string): Từ khóa tìm kiếm (tìm trong name, description, ingredients, steps)
- `category` (ObjectId): ID của category
- `difficulty` (string): Dễ | Trung bình | Khó
- `page` (number): Số trang (default: 1)
- `limit` (number): Số items per page (default: 10, max: 100)

**Example:**

```bash
GET /api/foods/search?keyword=bánh&difficulty=Dễ&page=1&limit=5
```

**Response:**

```json
{
  "success": true,
  "keyword": "bánh",
  "category": null,
  "difficulty": "Dễ",
  "page": 1,
  "totalPages": 3,
  "totalItems": 15,
  "data": [
    {
      "_id": "675ec...",
      "name": "Bánh áp chảo mì gói và bắp",
      "description": "Món ăn vặt ngon...",
      "categories": [
        { "_id": "675ec...", "name": "Ăn vặt" }
      ],
      "time": "10 Phút",
      "difficulty": "Dễ",
      "image": "https://...",
      "calories": "223 kcal"
    }
  ]
}
```

---

### Ingredients Search

#### `GET /api/ingredients/search`

Tìm kiếm nguyên liệu theo keyword, type

**Query Parameters:**

- `keyword` (string): Từ khóa (tìm trong name, type, description)
- `type` (string): Rau củ | Thịt | Hải sản | Gia vị | Ngũ cốc | Trái cây | Sữa & Trứng | Khác
- `isAvailable` (boolean): true | false
- `page` (number): Số trang
- `limit` (number): Số items per page

**Example:**

```bash
GET /api/ingredients/search?keyword=thịt&type=Thịt&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "keyword": "thịt",
  "type": "Thịt",
  "page": 1,
  "totalPages": 1,
  "totalItems": 5,
  "data": [
    {
      "_id": "675ec...",
      "name": "Thịt bò",
      "type": "Thịt",
      "description": "Thịt bò tươi, ít mỡ",
      "nutrition": {
        "calories": 250,
        "protein": 26,
        "fat": 15,
        "carbs": 0
      },
      "unit": "kg",
      "pricePerUnit": 250000,
      "isAvailable": true
    }
  ]
}
```

---

### Categories Search

#### `GET /api/categories/search`

Tìm kiếm danh mục theo keyword

**Query Parameters:**

- `keyword` (string): Từ khóa tìm kiếm tên danh mục
- `page` (number): Số trang (default: 1)
- `limit` (number): Số items per page (default: 20, max: 100)

**Example:**

```bash
GET /api/categories/search?keyword=ăn vặt&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "keyword": "ăn vặt",
  "page": 1,
  "totalPages": 1,
  "totalItems": 2,
  "data": [
    {
      "_id": "675ec...",
      "name": "Ăn vặt",
      "foodCount": 15,
      "createdAt": "2024-10-20T..."
    },
    {
      "_id": "675ec...",
      "name": "Món ăn vặt",
      "foodCount": 8,
      "createdAt": "2024-10-19T..."
    }
  ]
}
```

#### `GET /api/categories`

Lấy danh sách tất cả danh mục với số lượng món ăn

**Query Parameters:**

- `page` (number): Số trang
- `limit` (number): Số items per page (default: 50)

**Response:**

```json
{
  "success": true,
  "page": 1,
  "totalPages": 1,
  "totalItems": 10,
  "data": [
    {
      "_id": "675ec...",
      "name": "Ăn vặt",
      "foodCount": 15,
      "createdAt": "2024-10-20T..."
    }
  ]
}
```

#### `GET /api/categories/:id`

Lấy chi tiết danh mục và danh sách món ăn trong danh mục

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "675ec...",
    "name": "Ăn vặt",
    "foodCount": 15,
    "foods": [
      {
        "_id": "675ec...",
        "name": "Bánh áp chảo mì gói và bắp",
        "image": "https://...",
        "difficulty": "Dễ",
        "time": "10 Phút",
        "calories": "223 kcal"
      }
    ],
    "createdAt": "2024-10-20T..."
  }
}
```

#### `GET /api/categories/:id/foods`

Lấy danh sách món ăn trong danh mục với phân trang

**Query Parameters:**

- `page` (number): Số trang
- `limit` (number): Số items per page (default: 10, max: 50)
- `difficulty` (string): Dễ | Trung bình | Khó

**Example:**

```bash
GET /api/categories/675ec.../foods?difficulty=Dễ&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "category": {
    "_id": "675ec...",
    "name": "Ăn vặt"
  },
  "page": 1,
  "totalPages": 2,
  "totalItems": 12,
  "data": [
    {
      "_id": "675ec...",
      "name": "Bánh áp chảo mì gói và bắp",
      "description": "...",
      "categories": [...],
      "difficulty": "Dễ",
      "time": "10 Phút"
    }
  ]
}
```

#### `GET /api/categories/stats/summary`

Lấy thống kê tổng quan các danh mục

**Response:**

```json
{
  "success": true,
  "totalCategories": 10,
  "data": [
    {
      "_id": "675ec...",
      "name": "Ăn vặt",
      "totalFoods": 15,
      "byDifficulty": {
        "easy": 8,
        "medium": 5,
        "hard": 2
      }
    }
  ]
}
```

---
