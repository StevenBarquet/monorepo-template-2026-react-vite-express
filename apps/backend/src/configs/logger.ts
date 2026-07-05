import debug from 'debug';

/* *Recuerda definir la variable de entorno DEBUG=app:* en desarrollo y otras según el entorno */
export const logger = {
  prod: debug('app:prod'),
  warn: debug('app:warn'),
  error: debug('app:error'),
  debug: debug('app:Debug'),
};
