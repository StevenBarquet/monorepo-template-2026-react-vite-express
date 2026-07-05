import { secrets } from './secrets';

class Environments {
  PORT = 4000

  SUPER_SECRET_EXAMPLE = process.env.SUPER_SECRET_EXAMPLE || secrets?.SUPER_SECRET_EXAMPLE;
}

export const defaultEnvs = new Environments();
