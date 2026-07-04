// ---Dependencies
import React from 'react';
// ---Styles
import style from './SaveCancel.module.scss';
import { Button } from 'antd';
import { Icon } from '@iconify/react';

interface Props {
  onSave?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  saveDisabled?: boolean;
  cancelDisabled?: boolean;
}

/**
 * SaveCancel Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function SaveCancel({ onCancel, onSave, saveDisabled, cancelDisabled }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['SaveCancel']}>
      <Button
        onClick={onCancel}
        icon={<Icon icon='mdi:cancel' />}
        disabled={cancelDisabled}
      >
        Cancelar
      </Button>
      <Button
        onClick={onSave}
        icon={<Icon icon={'mdi:content-save'} />}
        type='primary'
        disabled={saveDisabled}
      >
        Guardar
      </Button>
    </div>
  );
}
