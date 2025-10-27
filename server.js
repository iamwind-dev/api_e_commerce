// server.js
// Load module aliases first
require('module-alias/register');
require('./module-alias');

// Then load environment variables
require('dotenv').config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB, prisma } = require("./config/db");

// Swagger
const swaggerUi = require("swagger-ui-express");
const openapi = require("./openapi.json");

const authRoutes = require("./src/routes/auth.route");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB().catch((err) => {
  console.error("DB connect error:", err);
  process.exit(1);
});

app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Health & DB ping
app.get("/health", (_req, res) =>
  res.json({ status: "healthy", ts: new Date().toISOString() })
);
app.get("/db/ping", async (_req, res, next) => {
  try {
    const [row] = await prisma.$queryRaw`SELECT DATABASE() AS db, NOW() AS now`;
    res.json(row);
  } catch (e) {
    next(e);
  }
});

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi, { explorer: true }));

// AUTH ONLY
app.use("/api/auth", authRoutes);

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Endpoint không tồn tại" })
);

// Error handler
app.use((err, _req, res, _next) => {
  console.error("Error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Lỗi server" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
  console.log(`📝 ENV: ${process.env.NODE_ENV || "development"}`);
});
