// ---Dependencys
import { ReactElement } from 'react';
import style from './HomeCont.module.scss';
// ---Components
import { HelloWorld } from './HelloWorld/HelloWorld';

/**
 * HomeCont Component: Contenedor principal de la landing. Placeholder base del
 * template — reemplázalo por el contenido real de tu proyecto.
 * @returns {ReactElement} ReactElement
 */
export function HomeCont(): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['HomeCont']}>
      <div className='centerContainer'>
        <h2>
          Monorepo <span>Template 2026</span>
        </h2>
        <div className='card'>
          <h3>Frontend listo 🎉</h3>
          <HelloWorld />
        </div>
      </div>
    </div>
  );
}
