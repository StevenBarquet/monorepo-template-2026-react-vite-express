import { secrets } from './secrets';

class Environments {
  // ---------------------------BACKEND ------
  // Esto es un ejemplo y para que corra agregué la env en el script de build, modifica a tu conveniencia
  DB_URL = process.env.DB_URL || secrets?.DB_URL;

  FRONTEND_URL = 'https://vivir-tekk.pages.dev';
}

export const prodEnvs = new Environments();
