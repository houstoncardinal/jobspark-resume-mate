import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when location changes
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-KP3WCTFTM1', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};
