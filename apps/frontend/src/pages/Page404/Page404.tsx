/* eslint-disable no-restricted-syntax */
// ---Dependencys
import { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
// ---Components
import { Page404Cont } from './Page404Cont/Page404Cont';

/**
 * Componente HomePage: este componente es para dar datos al Helmet de
 * la página y concatenarla con el contenedor de la página componente
 * @returns { ReactElement } ReactElement
 */
export default function Page404(): ReactElement {
  return (
    <>
      <Helmet>
        <title>Error 404</title>
      </Helmet>
      <Page404Cont />
    </>
  );
}
