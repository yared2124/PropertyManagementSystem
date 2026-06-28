/**
 * Redis Configuration
 * Provides a Redis client instance for caching, session storage, and job queues.
 * Uses environment variables for configuration.
 *
 * Redis is optional – if not configured, the app will still work (fallback).
 */

import { createClient } from "redis";

// =============================================
// 1. Load Redis URL from environment
// =============================================
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// =============================================
// 2. Create Redis Client
// =============================================
const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      // Exponential backoff: wait longer between reconnection attempts
      if (retries > 10) {
        console.error("❌ Redis: Max reconnection attempts reached.");
        return new Error("Redis max reconnection attempts");
      }
      // Wait 2^retries * 100ms (max 10s)
      const delay = Math.min(Math.pow(2, retries) * 100, 10000);
      console.log(
        `🔄 Redis: Reconnecting in ${delay}ms... (attempt ${retries})`,
      );
      return delay;
    },
  },
});

// =============================================
// 3. Event Handlers
// =============================================

// Connection successful
redisClient.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

// Connection ready (client is fully operational)
redisClient.on("ready", () => {
  console.log("✅ Redis client is ready");
});

// Connection error
redisClient.on("error", (error) => {
  console.error("❌ Redis error:", error.message);
});

// Connection closed
redisClient.on("end", () => {
  console.log("🔌 Redis connection closed");
});

// Reconnecting
redisClient.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

// =============================================
// 4. Connect to Redis
// =============================================
// Connect immediately when this module is imported
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("❌ Redis connection failed:", error.message);
    console.warn("⚠️  Redis is not available – continuing without caching.");
    // Don't throw – allow the app to run without Redis
  }
})();

// =============================================
// 5. Graceful Shutdown Helper
// =============================================
/**
 * Gracefully close the Redis connection.
 * Call this during application shutdown (e.g., SIGTERM).
 */
export const closeRedisConnection = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    console.log("✅ Redis connection closed gracefully");
  }
};

// =============================================
// 6. Utility Functions
// =============================================

/**
 * Check if Redis is connected and ready.
 * @returns {boolean} True if Redis is connected and ready.
 */
export const isRedisConnected = () => {
  return redisClient.isReady && redisClient.isOpen;
};

/**
 * Get a value from Redis cache.
 * @param {string} key - The cache key.
 * @returns {Promise<any>} Parsed JSON value or null.
 */
export const getCache = async (key) => {
  if (!isRedisConnected()) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("❌ Redis get cache error:", error.message);
    return null;
  }
};

/**
 * Set a value in Redis cache.
 * @param {string} key - The cache key.
 * @param {any} value - The value to cache (will be JSON stringified).
 * @param {number} ttl - Time to live in seconds (optional).
 */
export const setCache = async (key, value, ttl = 3600) => {
  if (!isRedisConnected()) return;
  try {
    const stringValue = JSON.stringify(value);
    if (ttl > 0) {
      await redisClient.setEx(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
  } catch (error) {
    console.error("❌ Redis set cache error:", error.message);
  }
};

/**
 * Delete a value from Redis cache.
 * @param {string} key - The cache key.
 */
export const deleteCache = async (key) => {
  if (!isRedisConnected()) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("❌ Redis delete cache error:", error.message);
  }
};

// =============================================
// 7. Export the Redis Client
// =============================================
export default redisClient;
