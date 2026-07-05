import { defaultEnvs } from './default';
import { devEnvs } from './dev';
import { prodEnvs } from './prod';

class EnvsLoader {
  runtimeEnvs = process.env.NODE_ENV === 'production' ? prodEnvs : devEnvs;

  notVerifiedEnvs = {
    NODE_ENV: process.env.NODE_ENV,
    ...defaultEnvs,
    ...this.runtimeEnvs
  };
  
  allEnvs = this.verify();
  
  verify() {
    const keys = Object.keys(this.notVerifiedEnvs);

    for (const index in keys) {
      const key = keys[index];
      // @ts-expect-error indexado dinámico de notVerifiedEnvs
      const isValid = this.isValidValue(this.notVerifiedEnvs[key]);
      if (!isValid)
        throw new Error(`\n\n---Error en envs ❌---\nLa variable ${key} está indefinida`);
    }
    return this.notVerifiedEnvs;
  }

  isValidValue(value: string | boolean | number) {
    if (typeof value === 'string' && value.length === 0) return false;
    if (value === undefined) return false;
    return true;
  }
}

export const notTypedEnvs = new EnvsLoader().allEnvs;
