// ---Dependencies
import React, { ReactNode } from 'react';
// ---Styles
import style from './SubBodyCard.module.scss';

/**
 * SubBodyCard Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function SubBodyCard({
  children,
  title,
  show = true,
}: {
  title: string | ReactNode;
  show?: boolean;
  children: ReactNode;
}) {
  if (!show) return null;
  return (
    <div className={style['SubBodyCard']}>
      <div className='title'>{title}</div>
      {children}
    </div>
  );
}

export function SubBodyInfo({
  label,
  value,
  className,
  spaced,
  valueColor,
  show = true
}: {
  label: string | ReactNode;
  className?: string;
  spaced?: boolean;
  value?: string | ReactNode;
  show?: boolean
  valueColor?: 'default' | 'red' | 'green' | 'primary' | 'secondary';
}) {
  if (!value || !show) return null;
  return (
    <div
      className={style['SubBodyInfo'] + ' ' + className || ''}
      style={spaced ? { marginTop: 6 } : {}}
    >
      <span>{label}</span>
      <span  className={`variant-${valueColor}`}>{value}</span>
    </div>
  );
}
