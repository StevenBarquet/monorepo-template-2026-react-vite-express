import type { NonUndefined } from 'shared/utils/global-types';

import { notTypedEnvs } from './envs';

export const TYPED_ENVS = notTypedEnvs as NonUndefined<typeof notTypedEnvs>;