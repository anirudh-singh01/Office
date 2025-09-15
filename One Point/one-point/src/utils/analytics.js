// Basic analytics tracking utility
class Analytics {
  constructor() {
    this.events = [];
    this.isEnabled = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    this.performanceMetrics = {};
    
    // Fallback configuration if ENV is not available
    this.config = {
      baseUrl: window.ENV?.baseUrl || 'https://snpsai-copilot-gtm',
      apiUrl: window.ENV?.apiUrl || 'https://snpsai-copilot-gtm/api',
      environment: window.ENV?.environment || 'production'
    };
  }

  // Track custom events
  track(eventName, properties = {}) {
    if (!this.isEnabled) {
      return;
    }

    const event = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }
    };

    this.events.push(event);
    
    // In a real implementation, you would send this to your analytics service
    // Example: Send to Google Analytics, Mixpanel, etc.
    // gtag('event', eventName, properties);
  }

  // Track tool usage
  trackToolUsage(toolId, toolName) {
    this.track('tool_opened', {
      tool_id: toolId,
      tool_name: toolName,
      category: 'synopsys_tools'
    });
  }

  // Track page views
  trackPageView(pageName) {
    this.track('page_view', {
      page_name: pageName,
      category: 'navigation'
    });
  }

  // Track user interactions
  trackInteraction(action, element) {
    this.track('user_interaction', {
      action: action,
      element: element,
      category: 'ui_interaction'
    });
  }

  // Track errors
  trackError(error, context = {}) {
    this.track('error', {
      error_message: error.message || error,
      error_stack: error.stack,
      context: context,
      category: 'error'
    });
  }

  // Track performance metrics
  trackPerformance() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.performanceMetrics = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: this.getFirstPaint(),
          firstContentfulPaint: this.getFirstContentfulPaint()
        };
        
        this.track('performance_metrics', {
          ...this.performanceMetrics,
          category: 'performance'
        });
      }
    }
  }

  // Get First Paint metric
  getFirstPaint() {
    const paintEntries = window.performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  // Get First Contentful Paint metric
  getFirstContentfulPaint() {
    const paintEntries = window.performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : null;
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;
