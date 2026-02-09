import { SiteSetting } from '../models/index.js';

class SettingsService {
  /**
   * Get all settings
   */
  async getAllSettings() {
    try {
      const settings = await SiteSetting.find().lean();
      
      // Convert to key-value object
      return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Return safe defaults if database fails
      return {
        phone_number: '0813-8535-3835',
        whatsapp_number: '6281385353835',
        instagram_link: 'https://www.instagram.com/gudang.pancing',
        store_name: 'Gudang Pancing'
      };
    }
  }

  /**
   * Get single setting by key
   */
  async getSetting(key) {
    const setting = await SiteSetting.findOne({ key }).lean();
    return setting?.value || null;
  }

  /**
   * Update or create setting
   */
  async upsertSetting(key, value) {
    return await SiteSetting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    ).lean();
  }

  /**
   * Update multiple settings
   */
  async updateSettings(settings) {
    const updates = Object.entries(settings).map(([key, value]) =>
      this.upsertSetting(key, value)
    );
    
    await Promise.all(updates);
    return await this.getAllSettings();
  }

  /**
   * Initialize default settings
   */
  async initializeDefaults() {
    const defaults = {
      phone_number: '0813-8535-3835',
      whatsapp_number: '6281385353835',
      instagram_link: 'https://www.instagram.com/gudang.pancing',
      tiktokshop_link: 'https://vt.tiktok.com/ZSaphRMjk/?page=Mall',
      tokopedia_link: 'https://tk.tokopedia.com/ZSaprv2rN/',
      shopee_link: 'https://id.shp.ee/ziz2aZB',
      store_name: 'Gudang Pancing',
      store_address: 'Ruko Terrace 9, Jl Jati Utama Blok D No.52, Suvarna Sutera, Tangerang',
      operating_hours: 'Senin - Minggu: 09.00 - 21.00 WIB'
    };

    for (const [key, value] of Object.entries(defaults)) {
      const existing = await this.getSetting(key);
      if (!existing) {
        await this.upsertSetting(key, value);
      }
    }

    return await this.getAllSettings();
  }
}

export default new SettingsService();
