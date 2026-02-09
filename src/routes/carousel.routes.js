import * as carouselController from '../controllers/carousel.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export default async function carouselRoutes(fastify, options) {
  // Public routes
  fastify.get('/', carouselController.getCarousel);

  // Admin routes
  fastify.get('/all', { preHandler: authenticate }, carouselController.getAllCarousel);
  fastify.post('/', { preHandler: authenticate }, carouselController.createCarouselItem);
  fastify.put('/:id', { preHandler: authenticate }, carouselController.updateCarouselItem);
  fastify.delete('/:id', { preHandler: authenticate }, carouselController.deleteCarouselItem);
}
