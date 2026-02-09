import crypto from 'crypto';

/**
 * Hash string using SHA256
 * @param {string} text - Text to hash
 * @returns {string} Hashed string
 */
export function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Create unique identifier from IP and User-Agent
 * @param {string} ip - User IP address
 * @param {string} userAgent - User-Agent header
 * @returns {object} Hashed IP and User-Agent
 */
export function createViewIdentifier(ip, userAgent) {
  return {
    hashedIp: hashText(ip),
    hashedUserAgent: hashText(userAgent || 'unknown')
  };
}

/**
 * Check if request is from bot/crawler
 * @param {string} userAgent - User-Agent header
 * @returns {boolean} True if bot
 */
export function isBot(userAgent) {
  if (!userAgent) return true;
  
  const botPatterns = [
    /bot/i, /crawl/i, /spider/i, /slurp/i,
    /mediapartners/i, /apis-google/i, /google favicon/i,
    /headless/i, /selenium/i, /phantom/i
  ];
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}
