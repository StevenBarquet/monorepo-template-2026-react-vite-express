/** Generic error response type */
export type MessageResponse = {
  message: string;
};

/** Error object response type standard */
export type ErrorResponse = {
  stack?: string;
} & MessageResponse;
