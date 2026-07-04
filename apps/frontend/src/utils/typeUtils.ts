import { ReactNode } from "react"

export type ReactSelectOpt<T> = {
  label: string | ReactNode
  value: T
}

/** Tipo de key válida para indexar un objeto. Se moverá a `@app/shared` cuando
 * se monte el workspace compartido. */
export type Indexable = string | number | symbol
