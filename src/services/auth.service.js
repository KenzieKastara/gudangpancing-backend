import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Admin, SiteSetting } from '../models/index.js';
import { OTP } from '../models/otp.model.js';
import emailService from './email.service.js';

class AuthService {
  /**
   * Generate 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Request password reset - send OTP to email
   * Only accepts email registered in Settings (admin_email)
   */
  async requestPasswordReset(email) {
    // Get admin_email from Settings
    const adminEmailSetting = await SiteSetting.findOne({ key: 'admin_email' });
    const registeredEmail = adminEmailSetting?.value;

    if (!registeredEmail) {
      throw new Error('Email admin belum diatur di Settings. Hubungi administrator.');
    }

    // Check if provided email matches the registered email in settings
    if (email.toLowerCase() !== registeredEmail.toLowerCase()) {
      throw new Error('Email tidak terdaftar. Gunakan email yang terdaftar di Settings.');
    }

    // Find admin account (to get username for email template)
    const admin = await Admin.findOne({});
    
    if (!admin) {
      throw new Error('Akun admin tidak ditemukan');
    }

    // Generate OTP
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: registeredEmail });

    // Save new OTP
    await OTP.create({
      email: registeredEmail,
      otp,
      expiresAt
    });

    // Send OTP via email
    await emailService.sendOTPEmail(registeredEmail, otp, admin.username);

    return { 
      success: true, 
      message: 'OTP telah dikirim ke email' 
    };
  }

  /**
   * Verify OTP
   */
  async verifyOTP(email, otp) {
    const otpRecord = await OTP.findOne({ 
      email, 
      otp,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      throw new Error('OTP tidak valid atau sudah expired');
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    return { success: true, message: 'OTP valid' };
  }

  /**
   * Reset password with OTP verification
   */
  async resetPassword(email, otp, newPassword) {
    // Get admin_email from Settings
    const adminEmailSetting = await SiteSetting.findOne({ key: 'admin_email' });
    const registeredEmail = adminEmailSetting?.value;

    if (!registeredEmail || email.toLowerCase() !== registeredEmail.toLowerCase()) {
      throw new Error('Email tidak valid');
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ 
      email: registeredEmail, 
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      throw new Error('OTP tidak valid atau sudah expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password (update the first/only admin)
    const admin = await Admin.findOneAndUpdate(
      {},
      { password: hashedPassword },
      { new: true }
    );

    if (!admin) {
      throw new Error('Admin tidak ditemukan');
    }

    // Delete used OTP
    await OTP.deleteMany({ email });

    return { 
      success: true, 
      message: 'Password berhasil direset' 
    };
  }

  /**
   * Register new admin
   */
  async register(email, username, password) {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }]
    });

    if (existingAdmin) {
      throw new Error('Admin with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({
      email,
      username,
      password: hashedPassword
    });

    await admin.save();

    return {
      id: admin._id.toString(),
      email: admin.email,
      username: admin.username,
      createdAt: admin.createdAt
    };
  }

  /**
   * Login admin
   */
  async login(usernameOrEmail, password) {
    console.log('LOGIN ATTEMPT:', usernameOrEmail);
    
    // Find admin
    const admin = await Admin.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    });

    console.log('ADMIN FOUND:', admin ? admin.username : 'NOT FOUND');

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log('PASSWORD VALID:', isValidPassword);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return {
      id: admin._id.toString(),
      email: admin.email,
      username: admin.username
    };
  }

  /**
   * Verify admin by ID
   */
  async verifyAdmin(adminId) {
    const admin = await Admin.findById(adminId).lean();

    if (!admin) return null;

    return {
      id: admin._id.toString(),
      email: admin.email,
      username: admin.username
    };
  }

  /**
   * Update admin profile (email and username)
   */
  async updateProfile(adminId, email, username) {
    // Convert string ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(adminId);
    
    // Check if email or username already used by another admin
    const existingAdmin = await Admin.findOne({
      _id: { $ne: objectId },
      $or: [{ email }, { username }]
    });

    if (existingAdmin) {
      throw new Error('Email or username already used by another admin');
    }

    const admin = await Admin.findByIdAndUpdate(
      objectId,
      { email, username },
      { new: true }
    ).lean();

    if (!admin) {
      throw new Error('Admin not found');
    }

    return {
      id: admin._id.toString(),
      email: admin.email,
      username: admin.username
    };
  }

  /**
   * Update admin password
   */
  async updatePassword(adminId, currentPassword, newPassword) {
    // Convert string ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(adminId);
    const admin = await Admin.findById(objectId);

    if (!admin) {
      throw new Error('Admin not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    return {
      id: admin._id.toString(),
      email: admin.email,
      username: admin.username
    };
  }
}

export default new AuthService();
