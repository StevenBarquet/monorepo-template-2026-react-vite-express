// ---Dependencies
import React from "react";
// ---Styles
import style from './YesNo.module.scss';

interface Props {
  value: boolean
}

/**
 * YesNo Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function YesNo({value}:Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <span className={`${style['YesNo']} ${style['YesNo']}-${value ? 'yes' : 'no'}`}>
      {value ? 'Sí' : 'No'}
    </span>
  );
}