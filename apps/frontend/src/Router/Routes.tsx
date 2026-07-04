/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-fragments */
// ---Dependencys
import { ReactElement, Fragment, lazy, Suspense } from 'react';
import { Route, Routes as RouteProv } from 'react-router-dom';
import { LazyLoadingScreen } from '../layout/LazyLoadingScreen/LazyLoadingScreen';
// ---Lazy loaded Modules
const LandingRoutes = lazy(() => import('src/Router/LandingRoutes'));

/**
 * Routes Component: raíz de ruteo de la aplicación. Agrupa los módulos de rutas
 * por sección y los carga de forma diferida (lazy). Agrega aquí nuevas secciones
 * (Auth, User, Admin, etc.) conforme crezca la app.
 * @returns {ReactElement} ReactElement
 */
export function Routes(): ReactElement {
  return (
    <Fragment>
      <Suspense fallback={<LazyLoadingScreen />}>
        <RouteProv>
          <Route path='/*' element={<LandingRoutes />} />
        </RouteProv>
      </Suspense>
    </Fragment>
  );
}
