import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';

// Routes
import authRoutes from './routes/auth.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import carouselRoutes from './routes/carousel.routes.js';
import instagramRoutes from './routes/instagram.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Database (with safe defaults)
import mongoose, { isConnected } from './config/database.js';

// Safe defaults for environment variables
const PORT = process.env.PORT || 8001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// JWT_SECRET is required - fail fast if not set in production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET environment variable is required in production');
  process.exit(1);
}
const jwtSecret = JWT_SECRET || 'dev-only-secret-key-change-in-production';

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: NODE_ENV === 'development' ? 'info' : 'error'
  }
});

// Wait a bit for MongoDB connection
await new Promise(resolve => setTimeout(resolve, 1000));

// Register plugins
await fastify.register(cors, {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

await fastify.register(jwt, {
  secret: jwtSecret
});

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes'
});

// Register multipart for file uploads
await fastify.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Health check endpoints (both /health and /api/health for compatibility)
const healthResponse = async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
};

fastify.get('/health', healthResponse);
fastify.get('/api/health', healthResponse);

// Register API routes with safe error handling
try {
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(analyticsRoutes, { prefix: '/api/analytics' });
  fastify.register(carouselRoutes, { prefix: '/api/carousel' });
  fastify.register(instagramRoutes, { prefix: '/api/instagram-feed' });
  fastify.register(settingsRoutes, { prefix: '/api/settings' });
  fastify.register(uploadRoutes, { prefix: '/api' });
} catch (error) {
  fastify.log.error('Error registering routes:', error);
}

// Global error handler - ensures server never crashes
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  
  reply.status(statusCode).send({
    success: false,
    message: NODE_ENV === 'development' ? message : 'Something went wrong',
    error: NODE_ENV === 'development' ? error.stack : undefined
  });
});

// Graceful shutdown
const closeGracefully = async (signal) => {
  fastify.log.info(`Received signal to terminate: ${signal}`);
  
  try {
    await mongoose.disconnect();
  } catch (error) {
    fastify.log.warn('Error disconnecting database:', error.message);
  }
  
  try {
    await fastify.close();
  } catch (error) {
    fastify.log.warn('Error closing server:', error.message);
  }
  
  process.exit(0);
};

process.on('SIGINT', closeGracefully);
process.on('SIGTERM', closeGracefully);

// Catch unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  fastify.log.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - keep server running
});

// Start server with safe error handling
const start = async () => {
  try {
    const host = '0.0.0.0';
    
    await fastify.listen({ port: PORT, host });
    
    fastify.log.info(`🚀 Server running on http://${host}:${PORT}`);
    fastify.log.info(`📊 Environment: ${NODE_ENV}`);
    fastify.log.info(`📦 API Prefix: /api`);
    fastify.log.info(`💾 Database: ${mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'Safe mode'}`);
  } catch (error) {
    fastify.log.error('Failed to start server:', error);
    // Try alternative port if main port fails
    if (error.code === 'EADDRINUSE') {
      fastify.log.info('Port in use, trying alternative port 8002...');
      try {
        await fastify.listen({ port: 8002, host: '0.0.0.0' });
        fastify.log.info('🚀 Server running on http://0.0.0.0:8002');
      } catch (altError) {
        fastify.log.error('Failed to start on alternative port');
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

start();
