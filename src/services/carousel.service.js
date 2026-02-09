import { CarouselItem } from '../models/index.js';

class CarouselService {
  /**
   * Get all active carousel items (public)
   */
  async getActiveItems() {
    try {
      return await CarouselItem.find(
        { isActive: true },
        { _id: 1, imageUrl: 1, productName: 1, price: 1, currency: 1, link: 1, badge: 1, sortOrder: 1 }
      ).sort({ sortOrder: 1 }).limit(50).lean();
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      return []; // Return empty array on error
    }
  }

  /**
   * Get all carousel items (admin)
   */
  async getAllItems() {
    return await CarouselItem.find({}, { __v: 0 }).sort({ sortOrder: 1 }).limit(100).lean();
  }

  /**
   * Create carousel item
   */
  async createItem(data) {
    const item = new CarouselItem(data);
    return await item.save();
  }

  /**
   * Update carousel item
   */
  async updateItem(id, data) {
    return await CarouselItem.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  /**
   * Delete carousel item
   */
  async deleteItem(id) {
    return await CarouselItem.findByIdAndDelete(id);
  }
}

export default new CarouselService();
