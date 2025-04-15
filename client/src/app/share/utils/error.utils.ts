export interface ServerError {
  message: string;
  errors?: string[];
}

export interface HttpErrorResponse {
  error: ServerError;
}

export function formatError(error: HttpErrorResponse): string {
  return error?.error?.errors
    ? `${error.error.message}. ${error.error.errors.join(". ")}`
    : error.error.message;
}
