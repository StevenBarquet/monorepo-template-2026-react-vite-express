function eq(a, b) {
  return a === b
}
function or(a, b) {
  return a || b
}

module.exports = (plop) => {
  plop.setHelper('eq', eq)
  plop.setHelper('or', or)
  plop.setGenerator('mutationOrQuery', {
    description: 'Create a mutation or query',
    prompts: [
      {
        type: 'list',
        name: 'requestType',
        message: 'Tipo de petición?',
        default: 'query',
        choices: [
          {
            name: 'Query',
            value: 'query',
          },
          {
            name: 'Mutación',
            value: 'mutation',
          },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message:
          'Prefijo (palabras separadas) de tu mutación o query? Ex "admin usuarios" para crear nombres como AdminUsuarios, admin-usuarios o AdminUsuariosInput',
      },
      {
        type: 'confirm',
        name: 'haveParent',
        message: 'Tu mutación/query tiene un padre?',
        default: false,
      },
      {
        type: 'input',
        name: 'parentName',
        when: (data) => !data.haveParent,
        message: 'Se creara un nuevo padre, nombra tu parent query/mutacion',
      },
      {
        type: 'input',
        name: 'path',
        message:
          'Path de tu mutación/query? (click derecho copy path en el FOLDER donde quieres tu componente)',
      },
      {
        type: 'confirm',
        name: 'haveAuth',
        message: 'Tu mutación/query tiene autenticación?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'adminsOnly',
        message: 'Acceso solo para admins?',
        default: false,
        when: (data) => data.haveAuth,
      },
      {
        type: 'confirm',
        name: 'sendAuthUser',
        message: 'Enviar el authUser al controller?',
        default: false,
        when: (data) => data.haveAuth,
      },
      {
        type: 'confirm',
        name: 'haveInput',
        message: 'Tu mutación/query tiene gql input?',
        default: true,
      },
      {
        type: 'list',
        name: 'inputType',
        message: 'Tipo de input?',
        when: (data) => data.haveInput,
        choices: [
          {
            name: 'Nuevo input para ésta mutación/query',
            value: 'newInput',
          },
          {
            name: 'Id genérico (idGqlInput)',
            value: 'idGqlInput',
          },
          {
            name: 'Id list genérico (IdListGqlInput)',
            value: 'IdListGqlInput',
          },
          {
            name: 'React select genérico (RSelectSingleGqlInput)',
            value: 'RSelectSingleGqlInput',
          },
          {
            name: 'Sin definir (defineTuGqlInput)',
            value: 'defineTuGqlInput',
          },
        ],
      },
      {
        type: 'input',
        name: 'typeInputName',
        when: (data) => data.haveInput,
        message: 'Nombre del type de tu input? Ex: AdminUsuariosZodSchema',
      },
      {
        type: 'list',
        name: 'responseType',
        message: 'Tipo de response?',
        choices: [
          {
            name: 'Success genérico (SuccessGqlEntity)',
            value: 'SuccessGqlEntity',
          },
          {
            name: 'Sin definir (defineTuGqlResponse)',
            value: 'defineTuGqlResponse',
          },
        ],
      },
      {
        type: 'confirm',
        name: 'haveValidations',
        message: 'Tu mutación/query tiene validaciones?',
        default: true,
      },
      {
        type: 'input',
        name: 'uiPath',
        message:
          'Path de tu hook en el frontend? (click derecho copy path en el FOLDER donde quieres tu componente)',
      },
      {
        type: 'confirm',
        name: 'multipleQueries',
        when: (data) => data.requestType === 'query',
        message: 'Tu hook tiene multiples queries?',
        default: false,
      },
      {
        type: 'list',
        name: 'isLazyQuery',
        when: (data) => data.requestType === 'query',
        message: 'Tipo de hook query',
        default: false,
        choices: [
          {
            name: 'lazyQuery',
            value: true,
          },
          {
            name: 'useQuery',
            value: false,
          },
        ],
      },
    ],
    /** @param {{requestType: 'query'|'mutation', name: string, path: string, inputType: 'newInput' | 'idGqlInput' | 'RSelectSingleGqlInput' | 'defineTuGqlInput', haveParent: boolean, parentName: string, haveValidations: boolean}} props */
    actions: ({
      haveParent,
      haveValidations,
      requestType,
      multipleQueries,
      isLazyQuery,
      inputType,
    }) => {
      const ending = requestType === 'query' ? 'Q' : 'M'
      const queryPath = `{{path}}${
        !haveParent ? `/{{camelCase parentName}}${ending}` : ''
      }/{{camelCase name}}${ending}`

      const queryOrMutation = {
        type: 'add',
        path: `${queryPath}/index.ts`,
        templateFile: `querys/queryTemplate.hbs`,
      }

      const parentQuery = {
        type: 'add',
        path: `{{path}}/{{camelCase parentName}}/index.ts`,
        templateFile: `querys/parentQuery.hbs`,
      }

      const controller = {
        type: 'add',
        path: `${queryPath}/controller.ts`,
        templateFile: `querys/controller.hbs`,
      }

      const validations = {
        type: 'add',
        path: `${queryPath}/validations.ts`,
        templateFile: `querys/validations.hbs`,
      }

      const gqlInput = {
        type: 'add',
        path: `${queryPath}/gqlInput.ts`,
        templateFile: `querys/gqlInputExample.hbs`,
      }

      const supportMultiple = multipleQueries ? 'Multi' : ''
      const hookType =
        requestType === 'mutation'
          ? 'UseMutation'
          : isLazyQuery
            ? `${supportMultiple}LazyQuery`
            : `${supportMultiple}UseQuery`

      const hookName =
        requestType === 'mutation'
          ? 'use{{pascalCase name}}Mutate'
          : isLazyQuery
            ? 'useLazy{{pascalCase name}}'
            : 'useQuery{{pascalCase name}}'

      const hookPath = multipleQueries
        ? `${hookName}/index.ts`
        : `${hookName}.ts`

      const uiHook = {
        type: 'add',
        path: `{{uiPath}}/${hookPath}`,
        templateFile: `hooks/${hookType}.hbs`,
      }

      const querieExample = {
        type: 'add',
        path: `{{uiPath}}/${hookName}/gqlQuerys.ts`,
        templateFile: `hooks/exampleQueries.hbs`,
      }

      let actions = [queryOrMutation, controller, uiHook]

      if (!haveParent) actions.push(parentQuery)
      if (haveValidations) actions.push(validations)
      if (inputType === 'newInput') actions.push(gqlInput)
      if (multipleQueries && requestType === 'query')
        actions.push(querieExample)

      return actions
    },
  })
}
