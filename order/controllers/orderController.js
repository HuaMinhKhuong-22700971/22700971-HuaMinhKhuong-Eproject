const Order = require("../models/order");
const messageBroker = require("../utils/messageBroker");

class OrderController {
  async listenToQueue() {
    await messageBroker.consumeOrders(async (data) => {
      try {
        console.log("📥 Processing order:", data);
        const { products, username, orderId } = data;

        const totalPrice = products.reduce((sum, p) => sum + (p.price || 0), 0);

        const newOrder = new Order({
          products: products.map(p => p._id),
          totalPrice,
          username,
          status: "completed",
        });

        await newOrder.save();

        console.log("✅ Order saved successfully:", newOrder);

        // Gửi phản hồi lại queue “products” để product-service cập nhật status
        await messageBroker.publishMessage("products", {
          orderId,
          status: "completed",
        });
      } catch (error) {
        console.error("❌ Failed to process order:", error);
      }
    });
  }
}

module.exports = new OrderController();
