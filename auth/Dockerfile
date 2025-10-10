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

# Expose port (thay bằng PORT thực tế của service)
EXPOSE 3001

# Lệnh chạy service
CMD ["npm", "start"]
