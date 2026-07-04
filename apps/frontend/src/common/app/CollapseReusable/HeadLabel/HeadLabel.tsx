// ---Dependencies
import React from 'react';
// ---Styles
import style from './HeadLabel.module.scss';
import { Checkbox } from 'antd';
import { CollapseSelectionProps } from '../CollapseReusable';
import { Fcol, Frow } from 'react-forge-grid';

interface Props<T extends Record<string, any>> {
  selectionCtrl?: CollapseSelectionProps;
  record: T;
  trueLabel: React.ReactNode;
  justHead?: boolean;
}

/**
 * HeadLabel Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function HeadLabel<T extends Record<string, any>>({
  selectionCtrl,
  record,
  trueLabel,
  justHead,
}: Props<T>) {
  // -----------------------CONSTS, HOOKS, STATES
  const key = selectionCtrl?.key!;
  const selectedKeys = selectionCtrl?.selectedKeys!;
  const setSelectedKeys = selectionCtrl?.setSelectedKeys!;
  const checked = selectedKeys?.includes(record?.[key]);

  // -----------------------MAIN METHODS
  const handleChange = () => {
    setSelectedKeys(
      checked ? selectedKeys.filter((id) => id != record[key]) : [...selectedKeys, record[key]],
    );
  };
  // -----------------------HELPERS
  // -----------------------RENDER
  return (
    <div className={style['HeadLabel']} onClick={justHead ? (e) => e.stopPropagation() : undefined}>
      <Frow vAlign='middle'>
        {selectionCtrl ? (
          <Fcol span={12}>
            <div
              className='checkContainer'
              onClick={(e) => {
                e.stopPropagation();
                handleChange();
              }}
              role='button'
              tabIndex={0}
            >
              <Checkbox
                onClick={(e) => {
                  e.stopPropagation();
                }}
                checked={checked}
                onChange={handleChange}
              />
            </div>
          </Fcol>
        ) : null}
        <Fcol span={selectionCtrl ? 88 : 100}>{trueLabel}</Fcol>
      </Frow>
    </div>
  );
}
