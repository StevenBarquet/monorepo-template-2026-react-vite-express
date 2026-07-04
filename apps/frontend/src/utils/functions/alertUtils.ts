import { appColors } from 'src/providers/AntdProv/AntdProv';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { stringToJsx } from './stringToJsx';

const handleAsJsx = (message?: string | null | React.ReactNode) => {
  if (!message) return;
  if (typeof message === 'string' && message.startsWith('<') && message.endsWith('>')) {
    console.log('stringToJsx');
    return stringToJsx(message, { maxDepth: 2 });
  }
  return message;
};

export const appSwal = withReactContent(
  Swal.mixin({
    confirmButtonColor: appColors.primaryColor,
    customClass: {
      popup: 'appSwalPopup',
    },
  }),
);

const appSwalStyles = document.createElement('style');
appSwalStyles.innerHTML = `
  .appSwalPopup a {
    color: greenyellow;
  }
  b{
    color: ${appColors.primaryColor4};
    font-weight: 600;
  }
`;
document.head.appendChild(appSwalStyles);

export async function swalApiSuccessAuto(
  message?: string,
  thenCb?: (() => void) | (() => Promise<void>),
) {
  await appSwal.fire({
    title: 'Éxito',
    html: handleAsJsx(message) || 'Operación realizada con éxito',
    icon: 'success',
    timerProgressBar: true,
    timer: 5500,
  });
  thenCb?.();
}

export async function swalWarn(
  message?: string | React.ReactNode,
  thenCb?: (() => void) | (() => Promise<void>),
) {
  await appSwal.fire({
    title: 'Advertencia',
    html: handleAsJsx(message) || 'Está realizando una operación importante',
    icon: 'warning',
    timerProgressBar: true,
    timer: 6500,
  });
  thenCb?.();
}

export async function swalApiError(message?: string) {
  await appSwal.fire({
    title: 'OPERACIÓN FALLIDA',
    html:
      handleAsJsx(message) ||
      'Lo sentimos, hubo un problema al procesar tu solicitud. Por favor, asegúrate de que tu conexión a internet está estable y vuelve a intentarlo.',
    icon: 'error',
  });
}
export async function swalApiConfirm({
  callback,
  confirmMsg,
  fireSuccess = false,
  successMsg,
}: {
  callback: (() => void) | (() => Promise<void>);
  fireSuccess?: boolean;
  confirmMsg?: string | React.ReactNode;
  successMsg?: string;
}) {
  await appSwal
    .fire({
      title: '¿Estás seguro?',
      html:
        handleAsJsx(confirmMsg) ||
        'El proceso no puede revertirse o podría cambiar seriamente una funcionalidad.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await callback();
        if (fireSuccess) {
          await swalApiSuccessAuto(successMsg);
        }
      }
    });
}
