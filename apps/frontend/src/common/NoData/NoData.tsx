// ---Dependencies
import React from 'react';
// ---Styles
import style from './NoData.module.scss';
import { Icon } from '@iconify/react';

/**
 * NoData Component:  Descripción del comportamiento...
 */
export function NoData({ label }: { label?: string }) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['NoData']}>
      <h3 className='noData'>
        {label || 'Sin datos '}
        <Icon icon='iconoir:info-empty' />
      </h3>
    </div>
  );
}
