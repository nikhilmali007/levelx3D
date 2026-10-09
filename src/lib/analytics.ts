export const ANALYTICS_STORAGE_KEY = 'levelx3d_analytics_events';

export interface AnalyticsEvent {
  id: string;
  name: string;
  timestamp: number;
  params?: Record<string, any>;
  path: string;
}

const getEvents = (): AnalyticsEvent[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveEvent = (event: AnalyticsEvent) => {
  if (typeof window === 'undefined') return;
  try {
    const events = getEvents();
    events.push(event);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Analytics save failed', e);
  }
};

export const trackEvent = (name: string, params?: Record<string, any>) => {
  const event: AnalyticsEvent = {
    id: crypto.randomUUID(),
    name,
    timestamp: Date.now(),
    params,
    path: typeof window !== 'undefined' ? window.location.pathname : '',
  };
  saveEvent(event);

  // GA4 integration
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', name, params);
  }
};

export const trackPageView = (path: string) => {
  trackEvent('page_view', { page_path: path });
};

export const trackEcommerceEvent = (name: string, items: any[], value?: number) => {
  trackEvent(name, { items, value });
};

export const getAnalyticsSummary = () => {
  const events = getEvents();
  
  const pageViews = events.filter(e => e.name === 'page_view');
  const addCartEvents = events.filter(e => e.name === 'add_to_cart');
  const beginCheckoutEvents = events.filter(e => e.name === 'begin_checkout');
  const purchaseEvents = events.filter(e => e.name === 'purchase');

  const totalPageViews = pageViews.length;
  const totalEvents = events.length;

  const pageCounts = pageViews.reduce((acc, e) => {
    const p = e.params?.page_path || e.path;
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, views]) => ({ path, views }));

  const conversionRate = totalPageViews > 0 
    ? ((purchaseEvents.length / totalPageViews) * 100).toFixed(2)
    : '0.00';

  return {
    totalPageViews,
    totalEvents,
    topPages,
    funnel: {
      views: totalPageViews,
      cart: addCartEvents.length,
      checkout: beginCheckoutEvents.length,
      purchase: purchaseEvents.length
    },
    conversionRate
  };
};
