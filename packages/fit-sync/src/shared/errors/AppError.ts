// Base custom error class
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(404, message, details);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super(401, message, details);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class OllamaConnectionError extends AppError {
  constructor(message: string = 'Failed to connect to Ollama service', details?: unknown) {
    super(503, message, details);
    Object.setPrototypeOf(this, OllamaConnectionError.prototype);
  }
}

export class OllamaTimeoutError extends AppError {
  constructor(message: string = 'Ollama inference request timed out', details?: unknown) {
    super(504, message, details);
    Object.setPrototypeOf(this, OllamaTimeoutError.prototype);
  }
}
