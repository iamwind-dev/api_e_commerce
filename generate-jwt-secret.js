const crypto = require("crypto");

const bytes = parseInt(process.argv[2]) || 64;

if (bytes < 16 || bytes > 128) {
  console.error("❌ Error: Bytes must be between 16 and 128");
  process.exit(1);
}

const secret = crypto.randomBytes(bytes).toString("hex");

console.log("\n🔐 JWT Secret Generated Successfully!\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`Bytes: ${bytes} (${bytes * 8} bit)`);
console.log(`Length: ${secret.length} characters`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("Copy this to your .env file:\n");
console.log(`JWT_SECRET=${secret}\n`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

const entropy = bytes * 8;
console.log(
  `🔒 Security Level: ${
    entropy >= 512
      ? "Excellent (512-bit)"
      : entropy >= 256
      ? "Good (256-bit)"
      : "Fair (128-bit)"
  }`
);
console.log(`⚡ Entropy: ${entropy} bits\n`);
console.log("📝 Important Notes:");
console.log("   • Keep this secret safe and never commit to version control");
console.log("   • Use different secrets for development and production");
console.log("   • Rotate secrets periodically for enhanced security");
console.log("   • Minimum recommended: 256 bits (32 bytes)");
console.log("   • Recommended for production: 512 bits (64 bytes)\n");
