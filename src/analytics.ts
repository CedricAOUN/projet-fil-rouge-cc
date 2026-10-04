const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
let initialized = false;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function initAnalytics() {
  if (!GA_ID || !import.meta.env.PROD || initialized) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  // Queue events immediately, but download Analytics after the initial page load.
  const loadScript = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
  };
  const scheduleScript = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadScript, { timeout: 3000 });
    } else {
      setTimeout(loadScript, 1000);
    }
  };
  if (document.readyState === 'complete') scheduleScript();
  else window.addEventListener('load', scheduleScript, { once: true });
}

export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  window.gtag?.('event', name, params);
}
