// ---Dependencies
import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AntdProv } from './AntdProv/AntdProv';
import { ScrollToTop } from './ScrollToTop/ScrollToTop';

interface Props {
  children: ReactNode;
}

/**
 * GlobalProviders Component: agrupa los providers globales de la app (router,
 * theming, etc). Agrega aquí el provider del cliente tRPC / react-query cuando
 * se conecte el backend.
 * @param {Props} props - Parámetros del componente como: ...
 */
export function GlobalProviders({ children }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AntdProv>{children}</AntdProv>
    </BrowserRouter>
  );
}
