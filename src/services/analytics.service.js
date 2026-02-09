import { PageView } from '../models/index.js';
import { createViewIdentifier, isBot } from '../utils/hash.js';

class AnalyticsService {
  /**
   * Track page view (setiap kunjungan dihitung)
   */
  async trackPageView(ip, userAgent) {
    // Check if bot
    if (isBot(userAgent)) {
      return { tracked: false, reason: 'bot' };
    }

    const { hashedIp, hashedUserAgent } = createViewIdentifier(ip, userAgent);

    // Create new view (tanpa filter duplicate)
    await PageView.create({
      hashedIp,
      hashedUserAgent
    });

    return { tracked: true };
  }

  /**
   * Get analytics for a time range
   * @param {string} range - '1h', '1d', '7d', '1m', '1y', 'all'
   */
  async getAnalytics(range) {
    const { startDate, groupBy } = this.getRangeConfig(range);

    // Get total views
    const query = startDate ? { viewedAt: { $gte: startDate } } : {};
    const totalViews = await PageView.countDocuments(query);

    // Get grouped data
    const chartData = await this.getChartData(startDate, groupBy);

    return {
      range,
      total_views: totalViews,
      chart: chartData
    };
  }

  /**
   * Get configuration for date range
   */
  getRangeConfig(range) {
    const now = new Date();
    let startDate = null;
    let groupBy = 'day';

    switch (range) {
      case '1h':
        startDate = new Date(now - 60 * 60 * 1000);
        groupBy = 'minute';
        break;
      case '1d':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        groupBy = 'hour';
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case '1m':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        groupBy = 'day';
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        groupBy = 'month';
        break;
      case 'all':
        startDate = null;
        groupBy = 'month';
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
    }

    return { startDate, groupBy };
  }

  /**
   * Get chart data grouped by time period
   */
  async getChartData(startDate, groupBy) {
    const query = startDate ? { viewedAt: { $gte: startDate } } : {};
    // Add limit to prevent memory issues in production
    const views = await PageView.find(query, { viewedAt: 1, _id: 0 })
      .sort({ viewedAt: 1 })
      .limit(10000)
      .lean();

    // Group views by time period
    const grouped = {};

    views.forEach(view => {
      const label = this.formatLabel(view.viewedAt, groupBy);
      grouped[label] = (grouped[label] || 0) + 1;
    });

    // Convert to array format
    return Object.entries(grouped).map(([label, views]) => ({
      label,
      views
    }));
  }

  /**
   * Format date label based on grouping
   */
  formatLabel(date, groupBy) {
    const d = new Date(date);

    switch (groupBy) {
      case 'minute':
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      case 'hour':
        return `${d.getHours().toString().padStart(2, '0')}:00`;
      case 'day':
        return d.toISOString().split('T')[0];
      case 'month':
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      default:
        return d.toISOString().split('T')[0];
    }
  }
}

export default new AnalyticsService();
