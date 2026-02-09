import * as settingsController from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export default async function settingsRoutes(fastify, options) {
  // Public routes
  fastify.get('/', settingsController.getSettings);

  // Admin routes
  fastify.put('/', { preHandler: authenticate }, settingsController.updateSettings);
  fastify.post('/initialize', { preHandler: authenticate }, settingsController.initializeSettings);
}
