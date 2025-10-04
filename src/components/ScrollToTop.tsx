import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Extracts the pathname property from the location object
  const { pathname } = useLocation();

  // Automatically scrolls to the top on every page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render any visible UI
}

export default ScrollToTop;