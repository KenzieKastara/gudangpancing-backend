import { errorResponse } from '../utils/response.js';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return errorResponse(reply, 'Unauthorized - Invalid or missing token', 401);
  }
}
