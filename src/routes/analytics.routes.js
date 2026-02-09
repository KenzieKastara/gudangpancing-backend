import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export default async function analyticsRoutes(fastify, options) {
  // Public route - track view
  fastify.post('/track', analyticsController.trackView);

  // Admin routes
  fastify.get('/', { preHandler: authenticate }, analyticsController.getAnalytics);
}
