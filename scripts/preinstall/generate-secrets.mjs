// @ts-check
import fs  from 'fs';
import path  from 'path';
import { getDirname } from '../utils/getDirname.mjs';

const { __dirname } = getDirname();

export async function generateSecrets(pathOfSecrets) {
  // Define la ruta donde se creará el archivo secrets.ts
  const secretsPath = path.join(
    __dirname,
    '../../',
    pathOfSecrets
  );

  // Verifica si el archivo ya existe
  fs.access(secretsPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Si el archivo no existe, procede a crearlo
      const secretsContent = `
// Este archivo es pensado en desarrollo local o develop, para producción te recomiendo que inyectes las variables en process.env
class Environments {
  // ---------------------------BACKEND ------
  SUPER_SECRET_EXAMPLE= '1234';
}

// @ts-ignore
export const secrets: {[s: string]: string} = new Environments();
`;

      fs.writeFile(secretsPath, secretsContent, (err) => {
        if (err) {
          console.error('Error al crear el archivo secrets.ts:', err);
        } else {
          console.log('Archivo secrets.ts creado exitosamente.');
        }
      });
    } else {
      // Si el archivo ya existe, muestra un mensaje y no hace nada
      console.log('El archivo secrets.ts ya existe.');
    }
  });
}
