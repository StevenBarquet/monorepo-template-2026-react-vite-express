// ---Dependencies
import React, { ReactNode } from 'react';
// ---Styles
import style from './ColoredLi.module.scss';

interface Props {
  index: number;
  children: ReactNode;
  className?: string;
}

/**
 * ColoredLi Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function ColoredLi({ children, index, className }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const type = index % 2 === 0 ? 'even' : 'odd';
  // -----------------------MAIN METHODS
  // -----------------------HELPERS
  // -----------------------RENDER
  return (
    <div className={style['ColoredLi']}>
      <div className={`${className || ''} ${style[type]}`}>{children}</div>
    </div>
  );
}
