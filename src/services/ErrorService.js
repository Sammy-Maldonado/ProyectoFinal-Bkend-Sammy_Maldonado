export default class ErrorService {
  static createError({ name, cause, message, code, status}) {
    const error = new Error(`${name}: ${message}\n codigo: ${code}\n status: ${status}\n cause: ${cause}`);
    error.code = code;
    error.status = status || 500;
    error.cause = cause;
    throw error;
  }
}