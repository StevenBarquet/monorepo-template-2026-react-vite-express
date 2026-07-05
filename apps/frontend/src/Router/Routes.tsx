/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-fragments */
// ---Dependencys
import { ReactElement, Fragment, lazy, Suspense } from 'react';
import { Route, Routes as RouteProv } from 'react-router-dom';
import { LazyLoadingScreen } from '../layout/LazyLoadingScreen/LazyLoadingScreen';
// ---Lazy loaded Modules
const AppRoutes = lazy(() => import('src/Router/AppRoutes'));

/**
 * Routes Component: raíz de ruteo de la aplicación. Carga los módulos de rutas de
 * forma diferida (lazy). Si la app crece, puedes agrupar rutas por sección
 * (p. ej. `/admin/*`, `/auth/*`) añadiendo más módulos aquí.
 * @returns {ReactElement} ReactElement
 */
export function Routes(): ReactElement {
  return (
    <Fragment>
      <Suspense fallback={<LazyLoadingScreen />}>
        <RouteProv>
          <Route path='/*' element={<AppRoutes />} />
        </RouteProv>
      </Suspense>
    </Fragment>
  );
}
