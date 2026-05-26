export const GA_ID = 'G-FDJECB72N1';

function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
}

export function pageview(url) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('config', GA_ID, {
    page_path: url,
    page_location: `${window.location.origin}${url}`,
  });
}

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, cleanParams({
    page_path: window.location.pathname,
    page_location: window.location.href,
    ...params,
  }));
}

export function trackSearch(eventName, query, params = {}) {
  const searchTerm = query.trim();
  if (searchTerm.length < 2) return;
  trackEvent(eventName, {
    search_term: searchTerm,
    ...params,
  });
}

export function trackVisitProject(tool, source) {
  trackEvent('visit_project', {
    tool_name: tool?.name,
    tool_slug: tool?.slug || tool?.id,
    tool_category: tool?.tag,
    tool_type: tool?.type,
    pricing: tool?.pricing,
    link_url: tool?.url,
    source,
  });
}
