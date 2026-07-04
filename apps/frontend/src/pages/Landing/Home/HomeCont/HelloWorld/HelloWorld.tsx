// ---Dependencys
import { ReactElement } from 'react';
import { FRONTEND_ENVS } from 'src/utils/constants/frontend-envs';

/**
 * HelloWorld Component: componente de ejemplo que muestra el environment actual.
 * Sirve para verificar que el frontend levanta y lee variables de entorno.
 * @returns {ReactElement} ReactElement
 */
export function HelloWorld(): ReactElement {
  // -----------------------RENDER
  return (
    <p>
      Entorno actual: <span>{FRONTEND_ENVS.MODE}</span>
    </p>
  );
}
