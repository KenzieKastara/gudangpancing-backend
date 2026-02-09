import uploadService from '../services/upload.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Upload image to Cloudinary
 */
export async function uploadImage(request, reply) {
  try {
    const data = await request.file();
    
    if (!data) {
      return errorResponse(reply, 'No file uploaded', 400);
    }

    // Get file buffer
    const buffer = await data.toBuffer();
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(data.mimetype)) {
      return errorResponse(reply, 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF', 400);
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return errorResponse(reply, 'File too large. Maximum 5MB', 400);
    }

    // Get folder from query or use default
    const folder = request.query.folder || 'gudang-pancing';

    // Upload to Cloudinary
    const result = await uploadService.uploadImage(buffer, folder);

    return successResponse(reply, {
      imageUrl: result.url,
      publicId: result.publicId
    }, 'Image uploaded successfully');

  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse(reply, error.message || 'Failed to upload image', 500);
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(request, reply) {
  try {
    const { publicId } = request.body;

    if (!publicId) {
      return errorResponse(reply, 'Public ID is required', 400);
    }

    const result = await uploadService.deleteImage(publicId);

    if (result.success) {
      return successResponse(reply, null, 'Image deleted successfully');
    } else {
      return errorResponse(reply, result.error || 'Failed to delete image', 500);
    }

  } catch (error) {
    console.error('Delete error:', error);
    return errorResponse(reply, error.message || 'Failed to delete image', 500);
  }
}
