// config/db.js
const { PrismaClient } = require("@prisma/client");

let prisma;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__PRISMA__) global.__PRISMA__ = new PrismaClient();
  prisma = global.__PRISMA__;
}

async function connectDB() {
  await prisma.$queryRaw`SELECT 1`;
  console.log("✅ Connected to MySQL (Cloud SQL) via Prisma");
}

module.exports = { prisma, connectDB };
