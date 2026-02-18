import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { LoginUseCase } from '@/application/use-cases/auth/Login.usecase';
import { IAdminUserRepository } from '@/domain/interfaces/IAdminUserRepository';
import { AdminUser } from '@/domain/entities/AdminUser';
import { UnauthorizedError } from '@/shared/errors/AppError';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('@/configs/index', () => ({
  __esModule: true,
  default: { jwtSecret: 'test-secret', jwtExpiresIn: '1h' },
}));

const mockUser: AdminUser = {
  id: 'user-1',
  username: 'admin',
  email: 'admin@example.com',
  hashedPassword: 'hashed',
  firstName: null,
  lastName: null,
  active: true,
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LoginUseCase', () => {
  it('should return token and user on valid credentials', async () => {
    const mockRepo: IAdminUserRepository = {
      findByUsername: jest.fn().mockResolvedValue(mockUser),
      updateLastLogin: jest.fn().mockResolvedValue(undefined),
    } as unknown as IAdminUserRepository;
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

    const useCase = new LoginUseCase(mockRepo);
    const result = await useCase.execute('admin', 'password');

    expect(mockRepo.findByUsername).toHaveBeenCalledWith('admin');
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed');
    expect(mockRepo.updateLastLogin).toHaveBeenCalledWith('user-1');
    expect(jwt.sign).toHaveBeenCalled();
    expect(result.token).toBe('fake-jwt-token');
    expect(result.user).toEqual({ id: 'user-1', username: 'admin', email: 'admin@example.com' });
  });

  it('should throw UnauthorizedError when user not found', async () => {
    const mockRepo: IAdminUserRepository = {
      findByUsername: jest.fn().mockResolvedValue(null),
    } as unknown as IAdminUserRepository;
    const useCase = new LoginUseCase(mockRepo);
    await expect(useCase.execute('admin', 'password')).rejects.toThrow(UnauthorizedError);
    await expect(useCase.execute('admin', 'password')).rejects.toThrow('Invalid credentials');
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError when user is inactive', async () => {
    const inactiveUser = { ...mockUser, active: false };
    const mockRepo: IAdminUserRepository = {
      findByUsername: jest.fn().mockResolvedValue(inactiveUser),
    } as unknown as IAdminUserRepository;
    const useCase = new LoginUseCase(mockRepo);
    await expect(useCase.execute('admin', 'password')).rejects.toThrow(UnauthorizedError);
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError when password is invalid', async () => {
    const updateLastLogin = jest.fn();
    const mockRepo: IAdminUserRepository = {
      findByUsername: jest.fn().mockResolvedValue(mockUser),
      updateLastLogin,
    } as unknown as IAdminUserRepository;
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const useCase = new LoginUseCase(mockRepo);
    await expect(useCase.execute('admin', 'wrong')).rejects.toThrow(UnauthorizedError);
    expect(updateLastLogin).not.toHaveBeenCalled();
  });
});
