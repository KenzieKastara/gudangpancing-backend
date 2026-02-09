import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class UploadService {
  /**
   * Upload image to Cloudinary
   * @param {Buffer} fileBuffer - The file buffer
   * @param {string} folder - Folder name in Cloudinary
   * @returns {Promise<{url: string, publicId: string}>}
   */
  async uploadImage(fileBuffer, folder = 'gudang-pancing') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        }
      );
      
      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - The public ID of the image
   */
  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { success: true };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new UploadService();
