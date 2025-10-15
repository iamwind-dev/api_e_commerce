# Sử dụng Node.js LTS version
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Chạy ứng dụng
CMD ["npm", "start"]
