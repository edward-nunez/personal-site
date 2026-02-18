import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '@/shared/errors/AppError';

describe('AppError', () => {
  it('should create error with message and statusCode', () => {
    const err = new AppError('Something failed', 500);
    expect(err.message).toBe('Something failed');
    expect(err.statusCode).toBe(500);
    expect(err.name).toBe('AppError');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('NotFoundError', () => {
  it('should set message and 404', () => {
    const err = new NotFoundError('Project');
    expect(err.message).toBe('Project not found');
    expect(err.statusCode).toBe(404);
  });

  it('should include identifier when provided', () => {
    const err = new NotFoundError('Project', 'id-123');
    expect(err.message).toContain('id-123');
  });
});

describe('ValidationError', () => {
  it('should set message, 400, and optional errors', () => {
    const err = new ValidationError('Invalid input', { field: 'email' });
    expect(err.message).toBe('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.errors).toEqual({ field: 'email' });
  });
});

describe('UnauthorizedError', () => {
  it('should set default message and 401', () => {
    const err = new UnauthorizedError();
    expect(err.message).toBe('Unauthorized');
    expect(err.statusCode).toBe(401);
  });
});

describe('ForbiddenError', () => {
  it('should set message and 403', () => {
    const err = new ForbiddenError('Access denied');
    expect(err.statusCode).toBe(403);
  });
});

describe('ConflictError', () => {
  it('should set message and 409', () => {
    const err = new ConflictError('Duplicate slug');
    expect(err.statusCode).toBe(409);
  });
});
