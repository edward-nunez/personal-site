import {
  CreateContactSubmissionUseCase,
  GetAllContactSubmissionsUseCase,
  GetContactSubmissionByIdUseCase,
  MarkContactAsReadUseCase,
} from '@/application/use-cases/contact/index';
import { IContactSubmissionRepository } from '@/domain/interfaces/IContactSubmissionRepository';
import {
  ContactSubmission,
  CreateContactSubmissionInput,
} from '@/domain/entities/ContactSubmission';
import { NotFoundError } from '@/shared/errors/AppError';

const mockSubmission: ContactSubmission = {
  id: 'id-1',
  name: 'Jane',
  email: 'jane@example.com',
  subject: 'Hello',
  message: 'Message text',
  read: false,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateContactSubmissionUseCase', () => {
  it('should create contact submission via repository', async () => {
    const mockRepo: IContactSubmissionRepository = {
      create: jest.fn().mockResolvedValue(mockSubmission),
    } as unknown as IContactSubmissionRepository;
    const useCase = new CreateContactSubmissionUseCase(mockRepo);
    const input: CreateContactSubmissionInput = {
      name: 'Jane',
      email: 'jane@example.com',
      subject: 'Hello',
      message: 'Message text',
    };
    const result = await useCase.execute(input);
    expect(mockRepo.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockSubmission);
  });
});

describe('GetAllContactSubmissionsUseCase', () => {
  it('should return all submissions from repository', async () => {
    const mockRepo: IContactSubmissionRepository = {
      findAll: jest.fn().mockResolvedValue([mockSubmission]),
    } as unknown as IContactSubmissionRepository;
    const useCase = new GetAllContactSubmissionsUseCase(mockRepo);
    const result = await useCase.execute();
    expect(mockRepo.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([mockSubmission]);
  });
});

describe('GetContactSubmissionByIdUseCase', () => {
  it('should return submission when found', async () => {
    const mockRepo: IContactSubmissionRepository = {
      findById: jest.fn().mockResolvedValue(mockSubmission),
    } as unknown as IContactSubmissionRepository;
    const useCase = new GetContactSubmissionByIdUseCase(mockRepo);
    const result = await useCase.execute('id-1');
    expect(mockRepo.findById).toHaveBeenCalledWith('id-1');
    expect(result).toEqual(mockSubmission);
  });

  it('should throw NotFoundError when not found', async () => {
    const mockRepo: IContactSubmissionRepository = {
      findById: jest.fn().mockResolvedValue(null),
    } as unknown as IContactSubmissionRepository;
    const useCase = new GetContactSubmissionByIdUseCase(mockRepo);
    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });
});

describe('MarkContactAsReadUseCase', () => {
  it('should return updated submission when found', async () => {
    const readSubmission = { ...mockSubmission, read: true };
    const mockRepo: IContactSubmissionRepository = {
      update: jest.fn().mockResolvedValue(readSubmission),
    } as unknown as IContactSubmissionRepository;
    const useCase = new MarkContactAsReadUseCase(mockRepo);
    const result = await useCase.execute('id-1');
    expect(mockRepo.update).toHaveBeenCalledWith({ id: 'id-1', read: true, notes: undefined });
    expect(result).toEqual(readSubmission);
  });

  it('should throw NotFoundError when update returns null', async () => {
    const mockRepo: IContactSubmissionRepository = {
      update: jest.fn().mockResolvedValue(null),
    } as unknown as IContactSubmissionRepository;
    const useCase = new MarkContactAsReadUseCase(mockRepo);
    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });
});
