import authService from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Register new admin
 */
export async function register(request, reply) {
  try {
    const { email, username, password } = request.body;

    // Validation
    if (!email || !username || !password) {
      return errorResponse(reply, 'Email, username, and password are required', 400);
    }

    if (password.length < 6) {
      return errorResponse(reply, 'Password must be at least 6 characters', 400);
    }

    const admin = await authService.register(email, username, password);

    return successResponse(reply, admin, 'Admin registered successfully', 201);
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Login admin
 */
export async function login(request, reply) {
  try {
    const { usernameOrEmail, password } = request.body;

    if (!usernameOrEmail || !password) {
      return errorResponse(reply, 'Username/email and password are required', 400);
    }

    const admin = await authService.login(usernameOrEmail, password);

    // Generate JWT token
    const token = request.server.jwt.sign({ 
      id: admin.id,
      email: admin.email,
      username: admin.username
    });

    return successResponse(reply, {
      admin,
      token
    }, 'Login successful');
  } catch (error) {
    return errorResponse(reply, error.message, 401);
  }
}

/**
 * Get current admin profile
 */
export async function getProfile(request, reply) {
  try {
    const adminId = request.user.id;
    const admin = await authService.verifyAdmin(adminId);

    if (!admin) {
      return errorResponse(reply, 'Admin not found', 404);
    }

    return successResponse(reply, admin);
  } catch (error) {
    return errorResponse(reply, error.message, 500);
  }
}

/**
 * Update admin profile (email and username)
 */
export async function updateProfile(request, reply) {
  try {
    const adminId = request.user.id;
    const { email, username } = request.body;

    if (!email || !username) {
      return errorResponse(reply, 'Email and username are required', 400);
    }

    const admin = await authService.updateProfile(adminId, email, username);

    return successResponse(reply, admin, 'Profile updated successfully');
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Update admin password
 */
export async function updatePassword(request, reply) {
  try {
    const adminId = request.user.id;
    const { currentPassword, newPassword } = request.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(reply, 'Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(reply, 'New password must be at least 6 characters', 400);
    }

    const admin = await authService.updatePassword(adminId, currentPassword, newPassword);

    return successResponse(reply, admin, 'Password updated successfully');
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Request password reset - send OTP
 */
export async function requestPasswordReset(request, reply) {
  try {
    const { email } = request.body;

    if (!email) {
      return errorResponse(reply, 'Email diperlukan', 400);
    }

    const result = await authService.requestPasswordReset(email);

    return successResponse(reply, result, result.message);
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP(request, reply) {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return errorResponse(reply, 'Email dan OTP diperlukan', 400);
    }

    const result = await authService.verifyOTP(email, otp);

    return successResponse(reply, result, result.message);
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Reset password with OTP
 */
export async function resetPassword(request, reply) {
  try {
    const { email, otp, newPassword } = request.body;

    if (!email || !otp || !newPassword) {
      return errorResponse(reply, 'Email, OTP, dan password baru diperlukan', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(reply, 'Password minimal 6 karakter', 400);
    }

    const result = await authService.resetPassword(email, otp, newPassword);

    return successResponse(reply, result, result.message);
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}
