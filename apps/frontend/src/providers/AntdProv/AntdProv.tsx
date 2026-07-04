// ---Dependencies
import { ConfigProvider, theme } from 'antd';
import React, { ReactNode } from 'react';
import colors from './appColors.module.scss';
import esES from 'antd/locale/es_ES';

interface Props {
  children: ReactNode;
}

export const appColors = colors;

/**
 * AntdProv Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function AntdProv({ children }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: appColors.primaryColor10 || undefined,
        },
      }}
      locale={esES}
    >
      {children}
    </ConfigProvider>
  );
}
