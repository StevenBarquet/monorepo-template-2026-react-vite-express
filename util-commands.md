<!-- Agregar paquetes a los workspaces con NPM -->
npm install -E --workspace=apps/backend xxxxxxxxxxx
npm install -E -D --workspace=apps/backend xxxxxx

npm install -E --workspace=apps/frontend xxxxxxxxxxx
npm install -E -D --workspace=apps/frontend xxxxxxxxxxx

<!-- Agregar paquetes a los workspaces con Yarn -->
yarn workspace backend add -E xxxxxxxxxxx
yarn workspace backend add -E xxxxxx --dev

yarn workspace frontend add -E xxxxxxxxxxx
yarn workspace frontend add -E xxxxxxxxxxx --dev