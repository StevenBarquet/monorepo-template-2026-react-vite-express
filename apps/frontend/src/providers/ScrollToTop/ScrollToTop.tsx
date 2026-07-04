import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const app = document.getElementById('root');
    if (!app) return;

    setTimeout(function () {
      app.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, [pathname]);

  return null;
}
