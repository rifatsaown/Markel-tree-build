// Import Node.js built-in crypto module for cryptographic functionality
const crypto = require('crypto');

/**
 * Creates a SHA-256 hash of the input data
 *
 * @param {string} data - The input data to be hashed
 * @returns {string} - The hexadecimal representation of the SHA-256 hash
 *
 * SHA-256 produces a 256-bit (32-byte) hash, which is represented as
 * a 64-character hexadecimal string
 */
function hashData(data) {
  return crypto
    .createHash('sha256') // Create SHA-256 hash instance
    .update(data) // Feed the data into the hash function
    .digest('hex'); // Get the final hash as hexadecimal string
}

// Export the hash function so other modules can use it
module.exports = { hashData };
