import * as uploadController from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export default async function uploadRoutes(fastify, options) {
  // Upload image (protected)
  fastify.post('/upload', { preHandler: authenticate }, uploadController.uploadImage);
  
  // Delete image (protected)
  fastify.delete('/upload', { preHandler: authenticate }, uploadController.deleteImage);
}
