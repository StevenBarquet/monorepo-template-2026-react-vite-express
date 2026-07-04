// ---Dependencies
import { ConfigProvider, theme } from 'antd';
import React, { ReactNode } from 'react';
import colors from './appColors.module.scss';

interface Props {
  children: ReactNode;
}

export const appColors = colors;

/**
 * AntdProvLight Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function AntdProvLight({ children }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: appColors.primaryColor8 || undefined,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
