// ---Dependencies
import React from 'react';
// ---Styles
import style from './LinkList.module.scss';
import { Link } from 'react-router-dom';

export interface LinkListProps {
  hide?: boolean;
  items?: {
    type: 'internal' | 'external';
    label: string | React.ReactNode;
    url: string;
  }[];
}

/**
 * LinkList Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function LinkList({ hide, items }: LinkListProps) {
  // -----------------------CONSTS, HOOKS, STATES
  const areElements = items && items?.length > 0;
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (hide || !areElements) return null;
  return (
    <div className={style['LinkList']}>
      {items.map((item, i) => (
        <div className={`item ${i % 2 === 0 ? 'even' : 'odd'}`}>
          {item.type === 'internal' ? (
            <Link to={item.url}>{item.label}</Link>
          ) : (
            <a href={item.url} target='_blank' rel='noopener noreferrer'>
              {item.label}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
