import {
  CreateProjectUseCase,
  GetAllProjectsUseCase,
  GetProjectBySlugUseCase,
  GetProjectByIdUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
} from '@/application/use-cases/project/index';
import { IProjectRepository } from '@/domain/interfaces/IProjectRepository';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/domain/entities/Project';
import { NotFoundError } from '@/shared/errors/AppError';

const mockProject: Project = {
  id: 'id-1',
  title: 'Test Project',
  slug: 'test-project',
  description: 'Description',
  shortDescription: null,
  technologies: ['TS'],
  category: 'web',
  tags: ['tag1'],
  githubUrl: null,
  liveUrl: null,
  godotWebExport: null,
  images: [],
  featured: true,
  status: 'published',
  startDate: null,
  endDate: null,
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateProjectUseCase', () => {
  it('should create project via repository', async () => {
    const mockRepo: IProjectRepository = {
      create: jest.fn().mockResolvedValue(mockProject),
    } as unknown as IProjectRepository;
    const useCase = new CreateProjectUseCase(mockRepo);
    const input: CreateProjectInput = {
      title: 'Test Project',
      slug: 'test-project',
      description: 'Description',
      category: 'web',
    };
    const result = await useCase.execute(input);
    expect(mockRepo.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockProject);
  });
});

describe('GetAllProjectsUseCase', () => {
  it('should return all projects from repository', async () => {
    const mockRepo: IProjectRepository = {
      findAll: jest.fn().mockResolvedValue([mockProject]),
    } as unknown as IProjectRepository;
    const useCase = new GetAllProjectsUseCase(mockRepo);
    const result = await useCase.execute();
    expect(mockRepo.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([mockProject]);
  });

  it('should pass options to repository', async () => {
    const mockRepo: IProjectRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    } as unknown as IProjectRepository;
    const useCase = new GetAllProjectsUseCase(mockRepo);
    await useCase.execute({ featured: true, orderBy: 'createdAt', orderDirection: 'desc' });
    expect(mockRepo.findAll).toHaveBeenCalledWith({
      featured: true,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    });
  });
});

describe('GetProjectBySlugUseCase', () => {
  it('should return project when found', async () => {
    const mockRepo: IProjectRepository = {
      findBySlug: jest.fn().mockResolvedValue(mockProject),
    } as unknown as IProjectRepository;
    const useCase = new GetProjectBySlugUseCase(mockRepo);
    const result = await useCase.execute('test-project');
    expect(mockRepo.findBySlug).toHaveBeenCalledWith('test-project');
    expect(result).toEqual(mockProject);
  });

  it('should throw NotFoundError when project not found', async () => {
    const mockRepo: IProjectRepository = {
      findBySlug: jest.fn().mockResolvedValue(null),
    } as unknown as IProjectRepository;
    const useCase = new GetProjectBySlugUseCase(mockRepo);
    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
    await expect(useCase.execute('missing')).rejects.toThrow('Project not found');
  });
});

describe('GetProjectByIdUseCase', () => {
  it('should return project when found', async () => {
    const mockRepo: IProjectRepository = {
      findById: jest.fn().mockResolvedValue(mockProject),
    } as unknown as IProjectRepository;
    const useCase = new GetProjectByIdUseCase(mockRepo);
    const result = await useCase.execute('id-1');
    expect(mockRepo.findById).toHaveBeenCalledWith('id-1');
    expect(result).toEqual(mockProject);
  });

  it('should throw NotFoundError when project not found', async () => {
    const mockRepo: IProjectRepository = {
      findById: jest.fn().mockResolvedValue(null),
    } as unknown as IProjectRepository;
    const useCase = new GetProjectByIdUseCase(mockRepo);
    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });
});

describe('UpdateProjectUseCase', () => {
  it('should return updated project when found', async () => {
    const mockRepo: IProjectRepository = {
      update: jest.fn().mockResolvedValue(mockProject),
    } as unknown as IProjectRepository;
    const useCase = new UpdateProjectUseCase(mockRepo);
    const input: UpdateProjectInput = { id: 'id-1', title: 'Updated' };
    const result = await useCase.execute(input);
    expect(mockRepo.update).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockProject);
  });

  it('should throw NotFoundError when project not found', async () => {
    const mockRepo: IProjectRepository = {
      update: jest.fn().mockResolvedValue(null),
    } as unknown as IProjectRepository;
    const useCase = new UpdateProjectUseCase(mockRepo);
    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(NotFoundError);
  });
});

describe('DeleteProjectUseCase', () => {
  it('should call delete and not throw when successful', async () => {
    const mockRepo: IProjectRepository = {
      delete: jest.fn().mockResolvedValue(true),
    } as unknown as IProjectRepository;
    const useCase = new DeleteProjectUseCase(mockRepo);
    await useCase.execute('id-1');
    expect(mockRepo.delete).toHaveBeenCalledWith('id-1');
  });

  it('should throw NotFoundError when delete returns false', async () => {
    const mockRepo: IProjectRepository = {
      delete: jest.fn().mockResolvedValue(false),
    } as unknown as IProjectRepository;
    const useCase = new DeleteProjectUseCase(mockRepo);
    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });
});
