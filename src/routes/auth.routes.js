import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export default async function authRoutes(fastify, options) {
  // Public routes
  fastify.post('/register', authController.register);
  fastify.post('/login', authController.login);
  
  // Forgot password routes (public)
  fastify.post('/forgot-password', authController.requestPasswordReset);
  fastify.post('/verify-otp', authController.verifyOTP);
  fastify.post('/reset-password', authController.resetPassword);

  // Protected routes
  fastify.get('/profile', { preHandler: authenticate }, authController.getProfile);
  fastify.put('/profile', { preHandler: authenticate }, authController.updateProfile);
  fastify.put('/password', { preHandler: authenticate }, authController.updatePassword);
}
