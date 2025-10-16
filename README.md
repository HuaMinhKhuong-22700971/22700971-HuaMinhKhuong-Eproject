# 🧩 E-Commerce Microservices System

## 🏗️ Giới thiệu

Dự án này mô phỏng hệ thống **E-Commerce** (thương mại điện tử) được xây dựng theo **kiến trúc Microservices**.  
Hệ thống bao gồm các service riêng biệt giao tiếp thông qua **RabbitMQ** (message broker) và sử dụng **MongoDB** để lưu trữ dữ liệu.

---

## ⚙️ Kiến trúc hệ thống

### Các service chính:

| Service | Mô tả | Cổng (Port) | Cơ sở dữ liệu | Giao tiếp qua |
|----------|--------|--------------|----------------|----------------|
| **Auth Service** | Xử lý đăng ký, đăng nhập, xác thực người dùng | `3000` | `authdb` | REST API |
| **Product Service** | Quản lý sản phẩm và xử lý yêu cầu đặt hàng | `3001` | `productdb` | RabbitMQ |
| **Order Service** | Tiếp nhận đơn hàng, tính tổng tiền, lưu vào MongoDB | `3002` | `orderdb` | RabbitMQ |
| **API Gateway** | Điểm truy cập duy nhất cho client (proxy đến các service) | `3003` | - | REST API |

---

## 🧰 Công nghệ sử dụng

- **Node.js + Express** – Framework backend chính
- **MongoDB** – Lưu trữ dữ liệu từng service
- **RabbitMQ** – Giao tiếp message giữa các service
- **Docker + Docker Compose** – Triển khai container
- **AMQP Library (`amqplib`)** – Kết nối đến RabbitMQ
- **JWT + Bcrypt** – Xác thực người dùng (Auth Service)

---

## 🧬 Luồng hoạt động

```mermaid
sequenceDiagram
    participant Client
    participant API_Gateway
    participant Product_Service
    participant RabbitMQ
    participant Order_Service
    participant MongoDB_Order

    Client->>API_Gateway: POST /api/products/buy
    API_Gateway->>Product_Service: Gửi yêu cầu mua hàng
    Product_Service->>RabbitMQ: Gửi message "orders"
    RabbitMQ->>Order_Service: Gửi đơn hàng để xử lý
    Order_Service->>MongoDB_Order: Lưu đơn hàng
    Order_Service->>RabbitMQ: Gửi phản hồi "products"
    RabbitMQ->>Product_Service: Nhận phản hồi hoàn tất
    Product_Service->>Client: Cập nhật trạng thái đơn hàng (completed)
🧱 Cấu trúc thư mục
css
Sao chép mã
EProject-Phase-1/
│
├── api-gateway/
│   ├── src/
│   │   ├── app.js
│   │   └── routes/
│   └── Dockerfile
│
├── auth-service/
│   ├── src/
│   │   ├── app.js
│   │   └── models/
│   └── Dockerfile
│
├── product-service/
│   ├── src/
│   │   ├── app.js
│   │   ├── models/
│   │   ├── controllers/
│   │   └── utils/messageBroker.js
│   └── Dockerfile
│
├── order-service/
│   ├── src/
│   │   ├── app.js
│   │   └── models/order.js
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
🐳 Cách chạy hệ thống
1️⃣ Yêu cầu cài đặt
Docker Desktop

Node.js >= 18

Postman (để test API)

2️⃣ Chạy hệ thống bằng Docker Compose
bash
Sao chép mã
docker compose up --build
🟢 Khi mọi thứ khởi động thành công, bạn sẽ thấy log:

vbnet
Sao chép mã
✅ MongoDB connected (Order Service)
✅ Connected to RabbitMQ (Product Service)
🚀 Product Service running on port 3002
🧪 Kiểm thử API
1️⃣ Tạo tài khoản (Auth Service)
POST http://localhost:3003/auth/register

json
Sao chép mã
{
  "username": "admin",
  "password": "123456"
}
2️Đăng nhập để lấy Token
POST http://localhost:3003/auth/login

→ Nhận về:

json
Sao chép mã
{
  "token": "eyJhbGciOi..."
}
3️Gửi yêu cầu mua hàng (Product Service)
POST http://localhost:3003/api/products/buy

json
Sao chép mã
{
  "username": "admin",
  "products": [
    { "name": "Laptop Dell", "price": 1200 },
    { "name": "Mouse Logitech", "price": 30 }
  ]
}
→ Kết quả trả về (tức thì):

json
Sao chép mã
{
  "message": "Order placed successfully, waiting for processing.",
  "orderId": "8d660b24-bf3c-4132-943f-1f01b7acacae",
  "status": "pending"
}
→ Sau khi Order Service xử lý xong (qua RabbitMQ), log hiển thị:

sql
Sao chép mã
Received order from user: admin
Order saved (ID: 6710e31a2a58a7a0d...)
Sent confirmation to queue [products]
Mô tả bất đồng bộ
Product Service không lưu đơn hàng trực tiếp mà chỉ gửi message sang Order Service.

Order Service nhận message, tính tổng tiền, lưu vào DB, rồi gửi phản hồi ngược lại.

Đây là mô hình Event-Driven Asynchronous Communication, giúp hệ thống:

Tách biệt giữa các service

Giảm tải API

Dễ mở rộng hoặc thay thế từng service

Dừng hệ thống
bash
Sao chép mã
docker compose down