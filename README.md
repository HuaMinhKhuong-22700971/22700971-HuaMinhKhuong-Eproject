Dự án **EProject Phase 1** được triển khai theo mô hình **Microservices** sử dụng **Node.js, Express, MongoDB và Docker**.

Hệ thống bao gồm các service:
- **Auth Service** – Xác thực và quản lý người dùng  
- **Product Service** – Quản lý thông tin phòng/sản phẩm  
- **Order Service** – Quản lý đơn đặt phòng  
- **API Gateway** – Trung gian điều phối request đến các service  
- **MongoDB** – Cơ sở dữ liệu dùng chung cho các service  

---

## Cấu trúc thư mục

EProject-Phase-1/
│
├── api-gateway/ # API Gateway Service
│ ├── Dockerfile
│ ├── package.json
│ └── index.js
│
├── auth/ # Auth Service
│ ├── Dockerfile
│ ├── package.json
│ └── server.js
│
├── product/ # Product Service
│ ├── Dockerfile
│ ├── package.json
│ └── server.js
│
├── order/ # Order Service
│ ├── Dockerfile
│ ├── package.json
│ └── server.js
│
├── docker-compose.yml # File cấu hình Docker Compose
├── .env # Biến môi trường chung
└── README.md # Tài liệu hướng dẫn

yaml
Sao chép mã

---

##  1. Chuẩn bị môi trường

### Yêu cầu:
- [Docker](https://www.docker.com/) ≥ 20.x  
- [Docker Compose](https://docs.docker.com/compose/) ≥ 1.29.x  
- Node.js ≥ 18 (chỉ cần nếu bạn muốn chạy từng service thủ công)

---

## 🌍 2. Cấu hình biến môi trường

Tạo file `.env` tại **thư mục gốc** của project với nội dung mẫu:

```env
# JWT Config
JWT_SECRET=mysecretkey
JWT_EXPIRES_IN=7d

# MongoDB
MONGO_URL=mongodb://mongodb:27017/eproject

# Ports
AUTH_PORT=3000
PRODUCT_PORT=3001
ORDER_PORT=3002
GATEWAY_PORT=3003
🐳 3. Build và khởi động toàn bộ hệ thống
Tại thư mục gốc (EProject-Phase-1), chạy lệnh:

bash
Sao chép mã
docker-compose up --build
Docker sẽ tự động:

Tạo mạng eproject-network

Chạy container mongodb

Build và khởi động lần lượt các service: auth, product, order, gateway

🔍 4. Kiểm tra container đang chạy
bash
Sao chép mã
docker ps
Kết quả mẫu:

nginx
Sao chép mã
CONTAINER ID   NAME               STATUS          PORTS
abc123def456   eproject-gateway   Up 10 seconds   0.0.0.0:3003->3003/tcp
def456ghi789   eproject-order     Up 15 seconds   0.0.0.0:3002->3002/tcp
ghi789jkl012   eproject-product   Up 20 seconds   0.0.0.0:3001->3001/tcp
jkl012mno345   eproject-auth      Up 25 seconds   0.0.0.0:3000->3000/tcp
mno345pqr678   mongodb            Up 30 seconds   0.0.0.0:27017->27017/tcp
🚪 5. Truy cập API Gateway
Truy cập:

arduino
Sao chép mã
http://localhost:3003
API Gateway sẽ định tuyến:

Endpoint	Service	URL nội bộ
/auth/*	Auth Service	http://eproject-auth:3000
/product/*	Product Service	http://eproject-product:3001
/order/*	Order Service	http://eproject-order:3002

🧹 6. Dừng và xóa toàn bộ container
bash
Sao chép mã
docker-compose down -v
🧠 7. Ghi chú
Nếu có thay đổi code trong bất kỳ service nào, hãy rebuild lại:

bash
Sao chép mã
docker-compose up --build
Nếu muốn kiểm tra log của 1 service:

bash
Sao chép mã
docker logs eproject-auth
docker logs eproject-product
docker logs eproject-order
docker logs eproject-gateway
🏁 Kết quả mong đợi
Sau khi khởi động thành công, bạn sẽ thấy log như sau:

vbnet
Sao chép mã
API Gateway listening on port 3003
Auth service connected to MongoDB
Product service connected to MongoDB
Order service connected to MongoDB