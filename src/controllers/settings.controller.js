import settingsService from '../services/settings.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Get all settings (public)
 */
export async function getSettings(request, reply) {
  try {
    const settings = await settingsService.getAllSettings();
    return successResponse(reply, settings);
  } catch (error) {
    return errorResponse(reply, error.message, 500);
  }
}

/**
 * Update settings (admin)
 */
export async function updateSettings(request, reply) {
  try {
    const updates = request.body;

    if (!updates || Object.keys(updates).length === 0) {
      return errorResponse(reply, 'No settings provided', 400);
    }

    const settings = await settingsService.updateSettings(updates);

    return successResponse(reply, settings, 'Settings updated successfully');
  } catch (error) {
    return errorResponse(reply, error.message, 400);
  }
}

/**
 * Initialize default settings
 */
export async function initializeSettings(request, reply) {
  try {
    const settings = await settingsService.initializeDefaults();
    return successResponse(reply, settings, 'Default settings initialized');
  } catch (error) {
    return errorResponse(reply, error.message, 500);
  }
}
