# Dùng Node.js base image
FROM node:18-alpine

# Tạo thư mục app trong container
WORKDIR /app

# Copy file package.json & package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Expose đúng port gateway
EXPOSE 3003

# Lệnh khởi chạy service
CMD ["npm", "start"]
