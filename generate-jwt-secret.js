#!/usr/bin/env node

/**
 * JWT Secret Generator
 * Sinh ra JWT secret key ngẫu nhiên an toàn
 * 
 * Usage:
 *   node generate-jwt-secret.js
 *   node generate-jwt-secret.js 32    # Sinh 32 bytes (256 bit)
 *   node generate-jwt-secret.js 64    # Sinh 64 bytes (512 bit)
 */

const crypto = require('crypto');

// Lấy số bytes từ command line argument, mặc định 64 bytes (512 bit)
const bytes = parseInt(process.argv[2]) || 64;

// Validate input
if (bytes < 16 || bytes > 128) {
  console.error('❌ Error: Bytes must be between 16 and 128');
  process.exit(1);
}

// Sinh JWT secret
const secret = crypto.randomBytes(bytes).toString('hex');

console.log('\n🔐 JWT Secret Generated Successfully!\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Bytes: ${bytes} (${bytes * 8} bit)`);
console.log(`Length: ${secret.length} characters`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Copy this to your .env file:\n');
console.log(`JWT_SECRET=${secret}\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Tính entropy
const entropy = bytes * 8;
console.log(`🔒 Security Level: ${entropy >= 512 ? 'Excellent (512-bit)' : entropy >= 256 ? 'Good (256-bit)' : 'Fair (128-bit)'}`);
console.log(`⚡ Entropy: ${entropy} bits\n`);

// Lưu ý
console.log('📝 Important Notes:');
console.log('   • Keep this secret safe and never commit to version control');
console.log('   • Use different secrets for development and production');
console.log('   • Rotate secrets periodically for enhanced security');
console.log('   • Minimum recommended: 256 bits (32 bytes)');
console.log('   • Recommended for production: 512 bits (64 bytes)\n');
