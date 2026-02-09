import { InstagramPost } from '../models/index.js';

class InstagramService {
  /**
   * Get all active Instagram posts (public)
   */
  async getActivePosts() {
    try {
      return await InstagramPost.find(
        { isActive: true },
        { _id: 1, imageUrl: 1, postUrl: 1, caption: 1, sortOrder: 1 }
      ).sort({ sortOrder: 1 }).limit(50).lean();
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      return []; // Return empty array on error
    }
  }

  /**
   * Get all Instagram posts (admin)
   */
  async getAllPosts() {
    return await InstagramPost.find({}, { __v: 0 }).sort({ sortOrder: 1 }).limit(100).lean();
  }

  /**
   * Create Instagram post
   */
  async createPost(data) {
    const post = new InstagramPost(data);
    return await post.save();
  }

  /**
   * Update Instagram post
   */
  async updatePost(id, data) {
    return await InstagramPost.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  /**
   * Delete Instagram post
   */
  async deletePost(id) {
    return await InstagramPost.findByIdAndDelete(id);
  }
}

export default new InstagramService();
