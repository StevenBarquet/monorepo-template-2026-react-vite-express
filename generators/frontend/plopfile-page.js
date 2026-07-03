const addRoute = require('./scripts/addRoute');

function eq(a, b) {
  return a === b;
}
function or(a, b) {
  return a || b;
}

module.exports = (plop) => {
  plop.setHelper('eq', eq);
  plop.setHelper('or', or);

  plop.setGenerator('component', {
    description: 'Create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message:
          'Prefijo de tus componentes. Ex "admin usuarios" -> AdminUsuarios / AdminUsuariosPage'
      },
      {
        type: 'confirm',
        name: 'isIndexable',
        message: 'Tu pagina es indexable?',
        default: false
      },
      {
        type: 'list',
        name: 'containerType',
        message: 'Folder path de tu page?',
        default: 'Root',
        choices: ['Landing', 'Admin', 'User', 'Auth'],
      },
      {
        type: 'input',
        name: 'route',
        message:
          'URL path de tu page? Ex: /compras o /inicio/FAQs (inicia con /)'
      }
    ],
    /**@param {{ containerType: "Admin" | "Landing" | "User" | "Auth" }} answers */
    actions: ({ isIndexable, route, name, containerType }) => {
      const indexType = isIndexable ? 'index' : 'app';
      const path = {
        Landing: '../../apps/frontend/src/pages/Landing',
        Admin: '../../apps/frontend/src/pages/Admin',
        User: '../../apps/frontend/src/pages/User',
        Auth: '../../apps/frontend/src/pages/Auth',
      }[containerType];
      
      const pageTemplate = {
        type: 'add',
        path: `${path}/{{pascalCase name}}/{{pascalCase name}}Page.tsx`,
        templateFile: `pages/${indexType}Page.tsx.hbs`
      };

      addRoute({
        route,
        containerType,
        path: `${path}/${toPascalCase(name)}/${toPascalCase(name)}Page.tsx`,
        component: `${toPascalCase(name)}Page.tsx`
      });

      const compTemplate = {
        type: 'add',
        path: `${path}/{{pascalCase name}}/{{pascalCase name}}/{{pascalCase name}}.tsx`,
        templateFile: `pages/container.tsx.hbs`
      };

      const styles = {
        type: 'add',
        path: `${path}/{{pascalCase name}}/{{pascalCase name}}/{{pascalCase name}}.module.scss`,
        templateFile: `pages/pageStyles.module.scss.hbs`
      };

      const actions = [pageTemplate, compTemplate, styles];
      return actions;
    }
  });
};

/** Receive a string and convert first letters of each word to uppercase and the rest to lowercase */
function toPascalCase(unformattedWord) {
  return unformattedWord
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
