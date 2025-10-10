const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();

// 👋 Route mặc định để kiểm tra gateway đang hoạt động
app.get("/", (req, res) => {
  res.send("🚀 API Gateway is running successfully!");
});

// 🔐 Auth Service
app.use("/auth", (req, res) => {
  proxy.web(req, res, { target: "http://eproject-auth:3000" });
});

// 🛍 Product Service
app.use("/products", (req, res) => {
  proxy.web(req, res, { target: "http://eproject-product:3001" });
});

// 📦 Order Service
app.use("/orders", (req, res) => {
  proxy.web(req, res, { target: "http://eproject-order:3002" });
});

// 🚀 Start Gateway
const port = process.env.GATEWAY_PORT || 3003;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
