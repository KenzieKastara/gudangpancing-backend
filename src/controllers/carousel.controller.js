import carouselService from '../services/carousel.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Get public carousel items
 */
export async function getCarousel(request, reply) {
  try {
    // Add no-cache headers for fresh data
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');
    
    const items = await carouselService.getActiveItems();
    return successResponse(reply, items);
  } catch (error) {
    return errorResponse(reply, error.message, 500);
  }
}

/**
 * Get all carousel items (admin)
 */
export async function getAllCarousel(request, reply) {
  try {
    const items = await carouselService.getAllItems();
    return successResponse(reply, items);
  } catch (error) {
    return errorResponse(reply, error.message, 500);
  }
}

/**
 * Create carousel item
 */
export async function createCarouselItem(request, reply) {
  try {
    const { imageUrl, productName, price, currency, link, badge, isActive, sortOrder } = request.body;

    if (!imageUrl || !productName || !price || !link) {
      return errorResponse(reply, 'imageUrl, productName, price, and link are required', 400);
    }

    const item = await carouselService.createItem({
      imageUrl,
      productName,
      price: parseFloat(price),
      currency: currency || 'IDR',
      link,
      badge,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0
    });

    return successResponse(reply, item, 'Carousel item created successfully', 201);
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Update carousel item
 */
export async function updateCarouselItem(request, reply) {
  try {
    const { id } = request.params;
    const updateData = request.body;

    if (!id || id === 'undefined') {
      return errorResponse(reply, 'Invalid item ID', 400);
    }

    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const item = await carouselService.updateItem(id, updateData);

    if (!item) {
      return errorResponse(reply, 'Item not found', 404);
    }

    return successResponse(reply, item, 'Carousel item updated successfully');
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Delete carousel item
 */
export async function deleteCarouselItem(request, reply) {
  try {
    const { id } = request.params;

    if (!id || id === 'undefined') {
      return errorResponse(reply, 'Invalid item ID', 400);
    }

    const item = await carouselService.deleteItem(id);

    if (!item) {
      return errorResponse(reply, 'Item not found', 404);
    }

    return successResponse(reply, null, 'Carousel item deleted successfully');
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}
