// ---Dependencies
import React, { useState } from 'react';
// ---Styles
import style from './SwalStyleModal.module.scss';
import { useBoolean } from 'src/utils/hooks/useBoolean';
import { Button, Modal } from 'antd';
import { Icon } from '@iconify/react';

interface Props<T> {
  modalCtr: SwalStyleModalCtr<T>;
  type:  'success' | 'warning' | 'error'|'confirm';
  alertTitle?: string;
  content?: React.ReactNode;
  onComplete?: () => void;
  onCompleteLabel?: string;
  onCancel?: () => void;
  onCancelLabel?: string;
  onCompleteIcon?: React.ReactNode;
}

/**
 * SwalStyleModal Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function SwalStyleModal<T>({ alertTitle, onCompleteIcon, modalCtr, type, content, onComplete, onCancel, onCancelLabel, onCompleteLabel }: Props<T>) {
  // -----------------------CONSTS, HOOKS, STATES
  const { openValue, closeModal } = modalCtr;
  // -----------------------MAIN METHODS
  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };
  const modalData={
    confirm: {
      title: '¿Estas seguro?',
      icon: 'ci:warning',
      message: 'Está realizando una operación importante'
    },
    success: {
      title: 'Éxito',
      icon: 'mdi:success',
      message: 'Operación realizada con éxito'
    },
    warning: {
      title: 'Advertencia',
      icon: 'ci:warning',
      message: 'Está realizando una operación importante'
    },
    error: {
      title: 'OPERACIÓN FALLIDA',
      icon: 'bitcoin-icons:cross-outline',
      message: 'Lo sentimos, hubo un problema al procesar tu solicitud. Por favor, asegúrate de que tu conexión a internet está estable y vuelve a intentarlo.'
    }
  }[type]

  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <Modal
      className={style['SwalStyleModal']}
      open={openValue}
      destroyOnHidden
      closable={false}
      width={'90%'}
      onCancel={handleCancel}
      footer={
        <section>
          {onComplete && <Button onClick={onComplete} type='primary' icon={onCompleteIcon ||<Icon icon='fluent-mdl2:completed-solid' />}>{onCompleteLabel || 'Completar'}</Button>}
          <Button onClick={handleCancel} icon={<Icon icon='mdi:cancel' />}>{onCancelLabel || 'Cancelar'}</Button>
        </section>
      }
    >
      <div className={`title title-${type}`}>
        <Icon icon={modalData.icon} />
        <span>{alertTitle || modalData.title}</span>
      </div>
      <div className='message'>
      {content || modalData.message}</div>
    </Modal>
  );
}

/**
 * useSwalStyleModalCtr: Hook para manejar el estado de un Modal.
 */
export function useSwalStyleModalCtr<T>({onClose}: {onClose?: () => void}) {
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
      onClose?.();
      setFalse();
    },
  };
}

export type SwalStyleModalCtr<T> = ReturnType<typeof useSwalStyleModalCtr<T>>;
