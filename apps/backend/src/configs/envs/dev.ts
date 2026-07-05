class Environments {
  // Valores de plantilla
  DB_URL = 'postgresql://prisma:supersecret123@localhost:5432/vivir-tekk';

  FRONTEND_URL = 'http://localhost:5173';
}

export const devEnvs = new Environments();
