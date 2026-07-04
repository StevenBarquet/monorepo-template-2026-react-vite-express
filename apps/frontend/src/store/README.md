import { envs } from 'src/envs/envsLoaded';

export const APP_NAME = 'QWIK_MLG_TEMPLATE';

export const IS_PROD = envs.NODE_ENV === 'production';
