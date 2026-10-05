const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
let initialized = false;
let allowed = false;
let cancelPending: (() => void) | undefined;
const SCRIPT_ID = 'google-analytics';

export function setAnalyticsConsent(accepted: boolean) {
  allowed = accepted;
  if (GA_ID) Reflect.set(window, `ga-disable-${GA_ID}`, !accepted);
  if (accepted) { initAnalytics(); return; }
  cancelPending?.();
  cancelPending = undefined;
  initialized = false;
  window.dataLayer?.splice(0);
  document.getElementById(SCRIPT_ID)?.remove();
  const domains = [location.hostname];
  const parts = location.hostname.split('.');
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(location.hostname)) {
    for (let i = 1; i < parts.length - 1; i++) domains.push(parts.slice(i).join('.'));
  }
  const paths = ['/'];
  const segments = location.pathname.split('/').filter(Boolean);
  for (let i = 1; i <= segments.length; i++) {
    const path = '/' + segments.slice(0, i).join('/');
    paths.push(path, path + '/');
  }
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
    for (const path of paths) {
      const expired = `${name}=; Max-Age=0; path=${path}`;
      document.cookie = expired;
      for (const domain of domains) document.cookie = `${expired}; domain=${domain}`;
    }
  }
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function initAnalytics() {
  if (!allowed || !GA_ID || !import.meta.env.PROD) return;
  if (!initialized) {
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      if (allowed) window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: false });
  }
  if (cancelPending || document.getElementById(SCRIPT_ID)) return;
  let idleId: number | undefined;
  let timerId: number | undefined;

  // Queue events immediately, but download Analytics after the initial page load.
  const loadScript = () => {
    cancelPending = undefined;
    if (!allowed || document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
  };
  const scheduleScript = () => {
    if (!allowed) return;
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(loadScript, { timeout: 3000 });
    } else {
      timerId = window.setTimeout(loadScript, 1000);
    }
  };
  cancelPending = () => {
    window.removeEventListener('load', scheduleScript);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timerId !== undefined) window.clearTimeout(timerId);
  };
  if (document.readyState === 'complete') scheduleScript();
  else window.addEventListener('load', scheduleScript, { once: true });
}

export function trackPageView(path: string) {
  if (!allowed || !GA_ID || !import.meta.env.PROD) return;
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!allowed || !GA_ID || !import.meta.env.PROD) return;
  window.gtag?.('event', name, params);
}
