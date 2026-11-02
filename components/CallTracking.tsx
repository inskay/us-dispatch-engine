'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function trackPhoneCallClick(label = 'Toll-Free Emergency Dispatch', extra: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'phone_call_click', {
      event_category: 'Conversion',
      event_label: label,
      value: 1,
      ...extra,
    });
  }
}

export function CallTracking() {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="tel:"]');
      if (target) {
        // Prevent double tracking if inline onClick already handled it
        if ((e as any).__gaCallTracked) return;
        (e as any).__gaCallTracked = true;

        const href = target.getAttribute('href') || '';
        const niche = target.getAttribute('data-niche') || 'general';
        const city = target.getAttribute('data-city') || '';
        const tracking = target.getAttribute('data-tracking') || 'call-btn';

        trackPhoneCallClick('Toll-Free Emergency Dispatch', {
          phone_number: href,
          niche,
          city,
          tracking,
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return null;
}
