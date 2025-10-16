const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const Order = require("./models/order");
const config = require("./config");

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setupOrderConsumer();
  }

  // ✅ Kết nối MongoDB
  async connectDB() {
    try {
      await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB connected (Order Service)");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
    }
  }

  // ✅ Nhận đơn hàng từ ProductService → Lưu vào DB → Gửi phản hồi lại
  async setupOrderConsumer() {
    console.log("⏳ Waiting for RabbitMQ to be ready...");

    // Delay để RabbitMQ container sẵn sàng (Docker Compose)
    setTimeout(async () => {
      try {
        const connection = await amqp.connect(config.rabbitMQURI);
        const channel = await connection.createChannel();

        // Đảm bảo queue tồn tại
        await channel.assertQueue(config.orderQueue, { durable: true });
        await channel.assertQueue(config.productQueue, { durable: true });

        console.log(`✅ Listening for messages on queue [${config.orderQueue}]`);

        // 👂 Nhận đơn hàng từ Product Service
        channel.consume(config.orderQueue, async (msg) => {
          if (!msg) return;

          try {
            const { products, username, orderId } = JSON.parse(msg.content.toString());
            console.log(`📩 Received order from user: ${username}`);

            // 🧮 Tính tổng tiền
            const totalPrice = products.reduce(
              (acc, p) => acc + (p.price || 0),
              0
            );

            // 💾 Lưu đơn hàng vào MongoDB
            const newOrder = new Order({
              products: products.map(p => p._id), // chỉ lưu ID sản phẩm
              totalPrice,
              user: username,
            });

            await newOrder.save();
            console.log(`💾 Order saved to MongoDB (ID: ${newOrder._id})`);

            // 📤 Gửi phản hồi lại ProductService
            const response = {
              orderId,
              username,
              totalPrice,
              status: "completed",
            };

            channel.sendToQueue(
              config.productQueue,
              Buffer.from(JSON.stringify(response)),
              { persistent: true }
            );

            console.log(`📤 Sent confirmation to [${config.productQueue}]`);
            channel.ack(msg);
          } catch (err) {
            console.error("❌ Error processing order:", err.message);
            channel.nack(msg, false, false);
          }
        });
      } catch (err) {
        console.error("❌ RabbitMQ connection failed:", err.message);
      }
    }, 10000);
  }

  // ✅ Khởi động server
  start() {
    const PORT = config.port || 3002;
    this.server = this.app.listen(PORT, () =>
      console.log(`🚀 Order Service running on port ${PORT}`)
    );
  }

  // ✅ Dừng server
  async stop() {
    await mongoose.disconnect();
    if (this.server) this.server.close();
    console.log("🛑 Order Service stopped");
  }
}

module.exports = App;
