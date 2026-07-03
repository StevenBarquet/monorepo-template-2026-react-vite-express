const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../../../apps/frontend/src/Router');

/** @param {{route: string, component: string, path: string, containerType: "Admin" | "Landing" | "User" | "Auth" }} params */
async function addRoute({route, path, containerType}) {
  try {
    // Leer el archivo existente
    const routerPath = `${FILE_PATH}/${containerType}Routes.tsx`
    let fileContent = fs.readFileSync(routerPath, 'utf-8');
    
    // Buscar la posición para insertar el nuevo componente importado (antes de 'Page404')
    const insertImportIndex = fileContent.lastIndexOf("import Page404 from 'src/pages/Page404/Page404';");
    if (insertImportIndex === -1) {
      console.error('No se pudo encontrar la posición adecuada para insertar el nuevo componente importado.');
      return;
    }
    
    // Construir la nueva importación
    const {trueComp, truePath} = getTrueInfo(path)
    const newImport = `import ${trueComp} from '${truePath}';\n`;
    
    // Insertar la nueva importación
    fileContent = fileContent.slice(0, insertImportIndex) + newImport + fileContent.slice(insertImportIndex);

    // Buscar la posición para insertar la nueva ruta
    const routesDefIndex = fileContent.lastIndexOf('<Routes>') + '<Routes>'.length;
    if (routesDefIndex === -1) {
      console.error('No se pudo encontrar la posición adecuada para insertar la nueva ruta.');
      return;
    }
    
    // Construir la nueva ruta
    const newRoute = `\n      <Route path='${route}' element={<${trueComp} />} />`;
    
    // Insertar la nueva ruta
    fileContent = fileContent.slice(0, routesDefIndex) + newRoute + fileContent.slice(routesDefIndex);

    // Sobrescribir el archivo con los nuevos contenidos
    fs.writeFileSync(routerPath, fileContent, 'utf-8');
    
    console.log('Ruta añadida con éxito.');
  } catch (error) {
    console.error('Error al modificar Routes.tsx:', error);
  }
  
}

function getTrueInfo(filePath) {
  const truePath = filePath.replace(/.*src\//, 'src/');
  const trueComp = truePath.replace(/.*\/([^\/]+)\.tsx$/, (match, p1) => p1.replace('Page', '') + 'Page');
  return { truePath: truePath.replace('.tsx', ''), trueComp };
}

module.exports = addRoute;