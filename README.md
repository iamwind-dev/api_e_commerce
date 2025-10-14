# E-Commerce Authentication API

Backend API xác thực người dùng cho hệ thống e-commerce với Node.js, Express.js, MongoDB và JWT authentication.

## Công nghệ sử dụng

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM cho MongoDB
- **bcryptjs** - Mã hóa mật khẩu
- **jsonwebtoken** - JWT authentication
- **dotenv** - Quản lý biến môi trường
- **cors** - Enable CORS

## ⚙️ Cài đặt

### 1. Clone project và cài dependencies

```bash
cd online-market-server
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

**⚠️ QUAN TRỌNG: Tạo JWT Secret an toàn**

```bash
# Tạo secret 512-bit (64 bytes) ngẫu nhiên
node -p "require('crypto').randomBytes(64).toString('hex')"

# Hoặc dùng script có sẵn
node generate-jwt-secret.js 64

# Windows PowerShell
.\generate-jwt-secret.ps1 64
```

Copy secret vừa tạo và dán vào file `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/online-market
JWT_SECRET=paste_your_generated_512bit_secret_here
PORT=3000
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Cài đặt và chạy MongoDB

### 4. Chạy server

```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`
