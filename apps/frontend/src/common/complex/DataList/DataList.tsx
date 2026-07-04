// ---Dependencies
import React from 'react';
// ---Styles
import style from './DataList.module.scss';

export interface DataListProps<T extends any[]> {
  hide?: boolean;
  items?: T;
  Render: React.FC<any>;
}

/**
 * DataList Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function DataList<T extends any[]>({ hide, items, Render }: DataListProps<T>) {
  // -----------------------CONSTS, HOOKS, STATES
  const areElements = items && items?.length > 0;
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (hide || !areElements) return null;
  return (
    <div className={style['DataList']}>
      {items.map((item, i) => (
        <div className={`item ${i % 2 === 0 ? 'even' : 'odd'}`}>
          <Render record={item} />
        </div>
      ))}
    </div>
  );
}
