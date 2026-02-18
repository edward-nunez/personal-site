import {
  GetAllBlogPostsUseCase,
  CreateBlogPostUseCase,
  GetBlogPostBySlugUseCase,
  GetBlogPostByIdUseCase,
  UpdateBlogPostUseCase,
  DeleteBlogPostUseCase,
  IncrementBlogPostViewsUseCase,
} from '@/application/use-cases/blog/index';
import { IBlogPostRepository } from '@/domain/interfaces/IBlogPostRepository';
import { BlogPost, CreateBlogPostInput, UpdateBlogPostInput } from '@/domain/entities/BlogPost';
import { NotFoundError } from '@/shared/errors/AppError';

const mockPost: BlogPost = {
  id: 'id-1',
  title: 'Test Post',
  slug: 'test-post',
  content: 'Content',
  excerpt: null,
  category: 'tech',
  tags: [],
  coverImage: null,
  published: true,
  publishedAt: new Date(),
  featured: false,
  views: 0,
  readTime: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GetAllBlogPostsUseCase', () => {
  it('should return all blog posts from repository', async () => {
    const mockRepo: IBlogPostRepository = {
      findAll: jest.fn().mockResolvedValue([mockPost]),
    } as unknown as IBlogPostRepository;
    const useCase = new GetAllBlogPostsUseCase(mockRepo);
    const result = await useCase.execute();
    expect(mockRepo.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([mockPost]);
  });

  it('should pass options to repository', async () => {
    const mockRepo: IBlogPostRepository = {
      findAll: jest.fn().mockResolvedValue([]),
    } as unknown as IBlogPostRepository;
    const useCase = new GetAllBlogPostsUseCase(mockRepo);
    await useCase.execute({ published: true, orderBy: 'publishedAt', orderDirection: 'desc' });
    expect(mockRepo.findAll).toHaveBeenCalledWith({
      published: true,
      orderBy: 'publishedAt',
      orderDirection: 'desc',
    });
  });
});

describe('CreateBlogPostUseCase', () => {
  it('should create blog post via repository', async () => {
    const mockRepo: IBlogPostRepository = {
      create: jest.fn().mockResolvedValue(mockPost),
    } as unknown as IBlogPostRepository;
    const useCase = new CreateBlogPostUseCase(mockRepo);
    const input: CreateBlogPostInput = {
      title: 'Test Post',
      slug: 'test-post',
      content: 'Content',
      category: 'tech',
    };
    const result = await useCase.execute(input);
    expect(mockRepo.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockPost);
  });
});

describe('GetBlogPostBySlugUseCase', () => {
  it('should return post when found', async () => {
    const mockRepo: IBlogPostRepository = {
      findBySlug: jest.fn().mockResolvedValue(mockPost),
    } as unknown as IBlogPostRepository;
    const useCase = new GetBlogPostBySlugUseCase(mockRepo);
    const result = await useCase.execute('test-post');
    expect(mockRepo.findBySlug).toHaveBeenCalledWith('test-post');
    expect(result).toEqual(mockPost);
  });

  it('should throw NotFoundError when not found', async () => {
    const mockRepo: IBlogPostRepository = {
      findBySlug: jest.fn().mockResolvedValue(null),
    } as unknown as IBlogPostRepository;
    const useCase = new GetBlogPostBySlugUseCase(mockRepo);
    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });
});

describe('GetBlogPostByIdUseCase', () => {
  it('should return post when found', async () => {
    const mockRepo: IBlogPostRepository = {
      findById: jest.fn().mockResolvedValue(mockPost),
    } as unknown as IBlogPostRepository;
    const useCase = new GetBlogPostByIdUseCase(mockRepo);
    const result = await useCase.execute('id-1');
    expect(mockRepo.findById).toHaveBeenCalledWith('id-1');
    expect(result).toEqual(mockPost);
  });

  it('should throw NotFoundError when not found', async () => {
    const mockRepo: IBlogPostRepository = {
      findById: jest.fn().mockResolvedValue(null),
    } as unknown as IBlogPostRepository;
    const useCase = new GetBlogPostByIdUseCase(mockRepo);
    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });
});

describe('UpdateBlogPostUseCase', () => {
  it('should return updated post when found', async () => {
    const mockRepo: IBlogPostRepository = {
      update: jest.fn().mockResolvedValue(mockPost),
    } as unknown as IBlogPostRepository;
    const useCase = new UpdateBlogPostUseCase(mockRepo);
    const input: UpdateBlogPostInput = { id: 'id-1', title: 'Updated' };
    const result = await useCase.execute(input);
    expect(mockRepo.update).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockPost);
  });

  it('should throw NotFoundError when not found', async () => {
    const mockRepo: IBlogPostRepository = {
      update: jest.fn().mockResolvedValue(null),
    } as unknown as IBlogPostRepository;
    const useCase = new UpdateBlogPostUseCase(mockRepo);
    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(NotFoundError);
  });
});

describe('DeleteBlogPostUseCase', () => {
  it('should not throw when delete succeeds', async () => {
    const mockRepo: IBlogPostRepository = {
      delete: jest.fn().mockResolvedValue(true),
    } as unknown as IBlogPostRepository;
    const useCase = new DeleteBlogPostUseCase(mockRepo);
    await useCase.execute('id-1');
    expect(mockRepo.delete).toHaveBeenCalledWith('id-1');
  });

  it('should throw NotFoundError when delete returns false', async () => {
    const mockRepo: IBlogPostRepository = {
      delete: jest.fn().mockResolvedValue(false),
    } as unknown as IBlogPostRepository;
    const useCase = new DeleteBlogPostUseCase(mockRepo);
    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });
});

describe('IncrementBlogPostViewsUseCase', () => {
  it('should call repository incrementViews', async () => {
    const mockRepo: IBlogPostRepository = {
      incrementViews: jest.fn().mockResolvedValue(undefined),
    } as unknown as IBlogPostRepository;
    const useCase = new IncrementBlogPostViewsUseCase(mockRepo);
    await useCase.execute('id-1');
    expect(mockRepo.incrementViews).toHaveBeenCalledWith('id-1');
  });
});
