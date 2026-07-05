import { NonUndefined } from 'shared/utils/global-types';

import { notTypedEnvs } from './envs';

/** Contiene todas las variables de entorno de la app, las envs de frontend necesitan el prefijo "NEXT_PUBLIC" para poder ser leidas en el front */
export const TYPED_ENVS = notTypedEnvs as NonUndefined<typeof notTypedEnvs>;