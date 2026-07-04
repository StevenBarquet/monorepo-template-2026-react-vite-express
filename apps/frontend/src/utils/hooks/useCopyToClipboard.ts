import { useMiniAlerts } from './useMiniAlerts';

interface Props {
  alertMsg?: string;
}

/**
 * Hook para copiar texto al portapapeles.
 *
 * @param {Props} props Parámetros del hook.
 * @param {string} [props.alertMsg] Mensaje de alerta para mostrar cuando se copia el texto.
 *
 * @returns Un objeto con la función `copyText` y el React Element `alertComponent`.
 * @returns {Object} Contiene las siguientes propiedades:
 * @returns {function} copyText - Función para copiar al portapapeles.
 * @returns {ReactElement} alertComponent - React Element con la alerta, agrégalo en tu jsx.
 */
export function useCopyToClipboard({ alertMsg }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { alertComponent, onSuccessAlert } = useMiniAlerts();
  // -----------------------MAIN METHODS
  function copyText(text: string) {
    copyToClipboard(text);
    onSuccessAlert(alertMsg || 'Copiado al portapapeles');
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return {
    /** Función para copiar al portapapeles */
    copyText,
    /** React Element con la alerta, agrégalo en tu jsx */
    alertComponent,
  };
}

export async function copyToClipboard(toCopy: string) {
  await navigator.clipboard.writeText(toCopy);
}
