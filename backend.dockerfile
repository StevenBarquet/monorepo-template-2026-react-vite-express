FROM node:20-alpine

# Dependencias del sistema para Prisma en Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /node-app

ENV PORT=4000
ENV DEBUG=app:prod

# Manifiestos primero (mejor cache)
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Código
COPY apps/backend ./apps/backend
COPY apps/shared ./apps/shared
COPY scripts ./scripts
COPY .git ./.git
COPY prisma ./prisma

ENV DB_URL=postgresql://prisma:supersecret123@localhost:5432/vivir-tekk

# Instalar dependencias
RUN npm install --include=dev
# RUN npm --prefix apps/backend install --include=dev


# Ejecuta el comando de Prisma desde la raíz, dado que la ruta es prisma/schema.prisma
RUN npm exec prisma db pull 
# RUN npm exec prisma generate --schema=./prisma/schema.prisma
RUN npm exec prisma generate 

# Diagnóstico rápido de Prisma
# RUN node -v && npm -v
# RUN npm ls prisma @prisma/client
# RUN npm exec prisma -v
# RUN npm exec prisma validate -- --schema=prisma/schema.prisma
# RUN echo "Modelos en schema:" && grep -n '^model ' prisma/schema.prisma || true
# RUN echo "Archivos generados:" && ls -la node_modules/@prisma/client
# RUN echo "Tipos generados (primeras líneas):" && head -n 120 node_modules/@prisma/client/index.d.ts
# RUN echo "Buscar 'Entidad/entidad' en tipos:" && (grep -n 'type Entidad' node_modules/@prisma/client/index.d.ts || grep -n 'type entidad' node_modules/@prisma/client/index.d.ts || true)

# RUN ls -la node_modules/.prisma/client
# RUN grep -n 'export type .*conjunto' node_modules/.prisma/client/index.d.ts || true

# Build (usa yarn si tu script es yarn back-build)
RUN yarn back-build

# Opcional: reducir tamaño (quitar dev deps)
# RUN npm prune --omit=dev && npm --prefix apps/backend prune --omit=dev

EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "apps/backend/dist/backend/src/index.js"]

# Image command:
# docker build  -t node_app_image -f backend.dockerfile .  --network host 

# Create container:
# docker run --name node-app-container --network host -p 4000:4000 -d --restart unless-stopped node_app_image

# Log container:
# docker container logs node-app-container

# Kill container:
# docker container rm node-app-container -f

