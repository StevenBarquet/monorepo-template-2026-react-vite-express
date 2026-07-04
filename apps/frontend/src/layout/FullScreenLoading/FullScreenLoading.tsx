// ---Dependencys
import { ReactElement } from 'react';
import { Spin } from 'antd';
import { useAppInfoStore } from 'src/store/appInfo';
import style from './FullScreenLoading.module.scss';

interface Props {
  isLoading?: boolean;
}
/**
 * FullScreenLoading Component: Componente de carga global, escucha el isLoading
 * global del store y pinta un spinner mientras esté activo. Recibe isLoading por
 * prop para debuggear estilos del spinner.
 * @returns {ReactElement} ReactElement
 */
export function FullScreenLoading({ isLoading: propLoading }: Props): ReactElement | null {
  // -----------------------CONSTS, HOOKS, STATES
  const { isLoadingGlobal: realIsLoading } = useAppInfoStore();
  const isLoading = propLoading || realIsLoading;
  // -----------------------RENDER
  if (isLoading) {
    return (
      <div className={style['FullScreenLoading']}>
        <Spin size='large' />
        <h2>Cargando...</h2>
      </div>
    );
  }
  return null;
}
