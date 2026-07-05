/** Utilidad personalizada para eliminar 'undefined' de los tipos de las propiedades */
export type NonUndefined<T> = {
  [K in keyof T]: Exclude<T[K], undefined>;
};
/** Utilidad personalizada para eliminar la posibilidad de objeto indefinido */
export type NonUndefinedObject<T> = T extends undefined ? never : T;

/** Array que solo admite strings que son nombres de las propiedades de una interfaz */
export type ArrayOfObjKeys<T> = Array<keyof T>;

/** Utilitario para agregar un id string a una interfaz */
export type WithId<T> = T & { id: string };

/** Utilitario para remover un id de una interfaz */
export type WithoutId<T> = Omit<T, 'id'>;

/** Indices genéricos */
export type Indexable = string | number | symbol;
