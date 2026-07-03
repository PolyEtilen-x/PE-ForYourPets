import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/tracking';

export function useBehaviorTracking() {
  const firedScrollDepths = useRef({
    p25: false,
    p50: false,
    p75: false,
    p100: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Scroll tracking handler
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight <= 0) return;

      const percentage = Math.round((scrollTop / scrollHeight) * 100);

      // Check thresholds
      if (percentage >= 25 && !firedScrollDepths.current.p25) {
        firedScrollDepths.current.p25 = true;
        trackEvent('scroll_depth_25', { percent: 25 });
      }
      if (percentage >= 50 && !firedScrollDepths.current.p50) {
        firedScrollDepths.current.p50 = true;
        trackEvent('scroll_depth_50', { percent: 50 });
      }
      if (percentage >= 75 && !firedScrollDepths.current.p75) {
        firedScrollDepths.current.p75 = true;
        trackEvent('scroll_depth_75', { percent: 75 });
      }
      if (percentage >= 98 && !firedScrollDepths.current.p100) {
        firedScrollDepths.current.p100 = true;
        trackEvent('scroll_depth_100', { percent: 100 });
      }
    };

    // 2. Click tracking handler
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find closest clickable element (button, link, or elements marked with data-track)
      const clickable = target.closest('button, a, [data-track]');
      if (!clickable) return;

      const text = clickable.textContent?.trim() || '';
      const tag = clickable.tagName.toLowerCase();
      const id = clickable.id || '';
      const customTrack = clickable.getAttribute('data-track') || '';

      // Skip internal chat typing actions or empty clicks to avoid clutter
      if (clickable.closest('form') && clickable.closest('[class*="chatWindow"]')) {
        return;
      }

      trackEvent('user_click', {
        tag,
        text: text.substring(0, 50), // Trim text to avoid long contents
        id,
        customTrack,
      });
    };

    // Attach listeners with passive flag for scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);

    // Initial check in case page starts scrolled down
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, []);
}
