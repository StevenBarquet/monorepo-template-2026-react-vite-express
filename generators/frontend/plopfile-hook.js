module.exports = (plop) => {
  plop.setGenerator('component', {
    description: 'Create a hook',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nombre de tu hook?',
      },
      {
        type: 'input',
        name: 'path',
        message: 'Path de tu hook? (click derecho copy path en el FOLDER donde quieres tu hook)',
      },
      {
        type: 'confirm',
        name: 'haveProps',
        message: 'Tu componente recibe props?',
        default: false,
      },
    ],
    actions: ({ haveProps }) => {
      const propsType = haveProps ? '' : 'NoProps';

      const hook = {
        type: 'add',
        path: '{{path}}/{{camelCase name}}.ts',
        templateFile: `others/hook${propsType}.ts.hbs`,
      };

      return [hook];
    },
  });
};
