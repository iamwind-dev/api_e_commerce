## 📡 API Endpoints

### 1. Lấy danh sách món ăn

**GET** `/api/foods`

**Query Parameters:**

- `category` (optional): ID của danh mục
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "page": 1,
  "totalPages": 3,
  "totalItems": 25,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Bánh áp chảo mì gói và bắp",
      "categories": [
        {
          "_id": "507f191e810c19729de860ea",
          "name": "Ăn vặt"
        },
        {
          "_id": "507f191e810c19729de860eb",
          "name": "Cuối tuần"
        }
      ],
      "time": "10 Phút",
      "difficulty": "Dễ",
      "image": "https://monngonmoingay.com/...",
      "calories": "223 kcal",
      "portion": "2 Người",
      "link": "https://monngonmoingay.com/..."
    }
  ]
}
```

**Ví dụ:**

```bash
# Lấy tất cả món ăn (page 1, 10 items)
GET /api/foods

# Lấy món ăn theo danh mục
GET /api/foods?category=507f191e810c19729de860ea

# Phân trang
GET /api/foods?page=2&limit=20

# Kết hợp filter và phân trang
GET /api/foods?category=507f191e810c19729de860ea&page=1&limit=15
```

### 2. Lấy chi tiết món ăn

**GET** `/api/foods/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Bánh áp chảo mì gói và bắp",
    "link": "https://monngonmoingay.com/...",
    "categories": [
      {
        "_id": "507f191e810c19729de860ea",
        "name": "Ăn vặt"
      }
    ],
    "portion": "2 Người",
    "time": "10 Phút",
    "ingredients": "Mì gói 40g, Thịt bacon...",
    "steps": "Làm nóng chảo với 1 ít dầu ăn...",
    "calories": "223 kcal",
    "difficulty": "Dễ",
    "image": "https://...",
    "preprocess": "Mì gói dùng chày đập sơ...",
    "serving": "Xếp ra dĩa, topping...",
    "page": 12
  }
}
```

### 3. Lấy danh sách danh mục

**GET** `/api/foods/list/categories`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f191e810c19729de860ea",
      "name": "Ăn vặt"
    },
    {
      "_id": "507f191e810c19729de860eb",
      "name": "Cuối tuần"
    },
    {
      "_id": "507f191e810c19729de860ec",
      "name": "Món chay"
    }
  ]

```
