import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Componente tonto wrapper que sirve para escrollear al top de la pagina cuando se interactua con la navegación de spa tipo react router */
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
