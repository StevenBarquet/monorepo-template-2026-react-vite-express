module.exports = (plop) => {
  plop.setGenerator('component', {
    description: 'Create a hook',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nombre de tu form, Ex: input login -> useInputLoginForm?',
      },
      {
        type: 'input',
        name: 'path',
        message: 'Path de tu hook? (click derecho copy path en el FOLDER donde quieres tu hook)',
      },
      
    ],
    actions: ({  }) => {

      const hook = {
        type: 'add',
        path: '{{path}}/use{{pascalCase name}}Form.ts',
        templateFile: `others/form.ts.hbs`,
      };

      return [hook];
    },
  });
};
