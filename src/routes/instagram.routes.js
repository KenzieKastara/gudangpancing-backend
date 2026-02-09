import * as instagramController from '../controllers/instagram.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export default async function instagramRoutes(fastify, options) {
  // Public routes
  fastify.get('/', instagramController.getInstagramFeed);

  // Admin routes
  fastify.get('/all', { preHandler: authenticate }, instagramController.getAllPosts);
  fastify.post('/', { preHandler: authenticate }, instagramController.createPost);
  fastify.put('/:id', { preHandler: authenticate }, instagramController.updatePost);
  fastify.delete('/:id', { preHandler: authenticate }, instagramController.deletePost);
}
