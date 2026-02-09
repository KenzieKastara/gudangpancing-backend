import analyticsService from '../services/analytics.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Track page view
 */
export async function trackView(request, reply) {
  try {
    const ip = request.ip;
    const userAgent = request.headers['user-agent'];

    const result = await analyticsService.trackPageView(ip, userAgent);

    return successResponse(reply, result);
  } catch (error) {
    return errorResponse(reply, error.message, 500);
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics(request, reply) {
  try {
    const { range = '7d' } = request.query;

    const validRanges = ['1h', '1d', '7d', '1m', '1y', 'all'];
    if (!validRanges.includes(range)) {
      return errorResponse(reply, 'Invalid range. Valid ranges: 1h, 1d, 7d, 1m, 1y, all', 400);
    }

    const analytics = await analyticsService.getAnalytics(range);

    return successResponse(reply, analytics);
  } catch (error) {
    return errorResponse(reply, error.message, 500);
  }
}
