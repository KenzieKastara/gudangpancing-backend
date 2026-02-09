import mongoose from 'mongoose';

const carouselSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'IDR' },
  link: { type: String, required: true },
  badge: String,
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const instagramSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  postUrl: { type: String, required: true },
  caption: String,
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true }
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const pageViewSchema = new mongoose.Schema({
  hashedIp: { type: String, required: true },
  hashedUserAgent: { type: String, required: true },
  viewedAt: { type: Date, default: Date.now }
});

export const CarouselItem = mongoose.model('CarouselItem', carouselSchema);
export const InstagramPost = mongoose.model('InstagramPost', instagramSchema);
export const SiteSetting = mongoose.model('SiteSetting', settingSchema);
export const Admin = mongoose.model('Admin', adminSchema);
export const PageView = mongoose.model('PageView', pageViewSchema);
