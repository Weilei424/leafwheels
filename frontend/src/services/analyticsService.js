import axios from 'axios';

class AnalyticsService {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.batchSize = 10;
    this.batchTimeout = 30000; // 30 seconds
    
    // Start batch sending timer
    setInterval(() => {
      this.flushEvents();
    }, this.batchTimeout);
  }
  
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  track(eventName, properties = {}) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
        userAgent: navigator.userAgent
      }
    };
    
    this.events.push(event);
    
    // If batch is full, send immediately
    if (this.events.length >= this.batchSize) {
      this.flushEvents();
    }
  }
  
  async flushEvents() {
    if (this.events.length === 0) return;
    
    const eventsToSend = [...this.events];
    this.events = [];
    
    try {
      await axios.post('/api/v1/analytics/events', {
        events: eventsToSend
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to queue for retry (optional)
      // this.events.unshift(...eventsToSend);
    }
  }
  
  // Common tracking methods
  trackPageView(pageName) {
    this.track('page_view', { page: pageName });
  }
  
  trackVehicleView(vehicleId, vehicleName) {
    this.track('vehicle_view', { vehicleId, vehicleName });
  }
  
  trackCartAction(action, itemId, itemType) {
    this.track('cart_action', { action, itemId, itemType });
  }
  
  trackSearch(query, results) {
    this.track('search', { query, resultCount: results });
  }
  
  trackCheckoutStep(step, orderTotal) {
    this.track('checkout_step', { step, orderTotal });
  }
  
  trackPurchase(orderId, orderTotal, items) {
    this.track('purchase', { orderId, orderTotal, itemCount: items.length });
  }
}

export const analytics = new AnalyticsService();
export default analytics;