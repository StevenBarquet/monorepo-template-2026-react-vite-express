// ---Dependencies
import React, { useState } from 'react';
// ---Styles
import style from './StyledModal.module.scss';
import { useBoolean } from 'src/utils/hooks/useBoolean';
import { Button, Modal } from 'antd';
import { Icon } from '@iconify/react';

interface Props<T> {
  modalCtr: StyledModalCtr<T>;
  title: string;
  content: React.ReactNode;
  onComplete?: () => void;
  onCompleteLabel?: string;
  onCancel?: () => void;
  onCancelLabel?: string;
  onCompleteIcon?: React.ReactNode;
}

/**
 * StyledModal Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function StyledModal<T>({ onCompleteIcon, modalCtr, title, content, onComplete, onCancel, onCancelLabel, onCompleteLabel }: Props<T>) {
  // -----------------------CONSTS, HOOKS, STATES
  const { openValue, closeModal } = modalCtr;
  // -----------------------MAIN METHODS
  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <Modal
      className={style['StyledModal']}
      title={title}
      open={openValue}
      destroyOnHidden
      onCancel={handleCancel}
      footer={
        <section>
          <Button onClick={handleCancel} icon={<Icon icon='mdi:cancel' />}>{onCancelLabel || 'Cancelar'}</Button>
          {onComplete && <Button onClick={onComplete} type='primary' icon={onCompleteIcon ||<Icon icon='fluent-mdl2:completed-solid' />}>{onCompleteLabel || 'Completar'}</Button>}
        </section>
      }
    >
      {content}
    </Modal>
  );
}

/**
 * useStyledModalCtr: Hook para manejar el estado de un Modal.
 */
export function useStyledModalCtr<T>() {
  const { value, setTrue, setFalse } = useBoolean();
  const [modalData, setModalData] = useState<T>();

  return {
    openValue: value,
    modalData,
    openModal: (modalInformation?: T) => {
      if (modalInformation) setModalData(modalInformation);
      setTrue();
    },
    closeModal: () => {
      setModalData(undefined);
      setFalse();
    },
  };
}

export type StyledModalCtr<T> = ReturnType<typeof useStyledModalCtr<T>>;
