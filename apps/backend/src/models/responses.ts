/** Tipo genérico de respuesta con mensaje */
export type MessageResponse = {
  message: string;
};

/** Tipo estándar de respuesta para objetos de error */
export type ErrorResponse = {
  stack?: string;
} & MessageResponse;
