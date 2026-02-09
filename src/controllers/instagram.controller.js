import instagramService from '../services/instagram.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Get public Instagram feed
 */
export async function getInstagramFeed(request, reply) {
  try {
    // Add no-cache headers for fresh data
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');
    
    const posts = await instagramService.getActivePosts();
    return successResponse(reply, posts);
  } catch (error) {
    return errorResponse(reply, error.message, 500);
  }
}

/**
 * Get all Instagram posts (admin)
 */
export async function getAllPosts(request, reply) {
  try {
    const posts = await instagramService.getAllPosts();
    return successResponse(reply, posts);
  } catch (error) {
    return errorResponse(reply, error.message, 500);
  }
}

/**
 * Create Instagram post
 */
export async function createPost(request, reply) {
  try {
    const { imageUrl, postUrl, caption, isActive, sortOrder } = request.body;

    if (!imageUrl || !postUrl) {
      return errorResponse(reply, 'imageUrl and postUrl are required', 400);
    }

    const post = await instagramService.createPost({
      imageUrl,
      postUrl,
      caption,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0
    });

    return successResponse(reply, post, 'Instagram post created successfully', 201);
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Update Instagram post
 */
export async function updatePost(request, reply) {
  try {
    const { id } = request.params;
    const updateData = request.body;

    const post = await instagramService.updatePost(id, updateData);

    return successResponse(reply, post, 'Instagram post updated successfully');
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Delete Instagram post
 */
export async function deletePost(request, reply) {
  try {
    const { id } = request.params;

    await instagramService.deletePost(id);

    return successResponse(reply, null, 'Instagram post deleted successfully');
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}
