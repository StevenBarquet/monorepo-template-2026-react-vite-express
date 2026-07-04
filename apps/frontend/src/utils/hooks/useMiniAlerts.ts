// ---Dependencies
import { message } from 'antd';

/**
 * Hook personalizado para mostrar alertas utilizando el componente message de Ant Design.
 *
 * @example
 * // Uso básico del hook en react
 * const { alertComponent, onSuccessAlert, onErrorAlert, onWarningAlert } = useMiniAlerts();
 *
 * // Mostrar una alerta de éxito
 * onSuccessAlert("Operación realizada con éxito");
 *
 * // Mostrar una alerta de error
 * onErrorAlert("Ha ocurrido un error");
 *
 * // Mostrar una alerta de advertencia
 * onWarningAlert("Atención: Verificar la información ingresada");
 *
 * @returns {Object} Contiene el componente de alerta y las funciones para mostrar alertas de éxito, error y advertencia.
 */
export function useMiniAlerts() {
  // -----------------------CONSTS, HOOKS, STATES
  const [messageApi, contextHolder] = message.useMessage();
  // -----------------------MAIN METHODS
  const onSuccessAlert = (message?: string) => {
    messageApi.open({
      type: 'success',
      content: message || 'Operación exitosa',
    });
  };

  const onErrorAlert = (message?: string) => {
    messageApi.open({
      type: 'error',
      content: message || 'Ha ocurrido un error',
    });
  };

  const onWarningAlert = (message?: string) => {
    messageApi.open({
      type: 'warning',
      content: message || 'Atención: Verificar la información ingresada',
    });
  };
  // -----------------------RENDER
  return {
    alertComponent: contextHolder,
    onSuccessAlert,
    onErrorAlert,
    onWarningAlert,
  };
}
