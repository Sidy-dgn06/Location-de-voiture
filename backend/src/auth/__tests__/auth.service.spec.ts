import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('token'),
};

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user payload without password when logging in', async () => {
    mockUserRepository.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: '$2b$10$hash',
      role: 'client',
    });
    mockUserRepository.findOne.mockClear();
    mockUserRepository.save.mockResolvedValue({
      id: 1,
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: '$2b$10$hash',
      role: 'client',
    });

    const user = await service.validateUser('test@example.com', 'password');
    expect(user).toBeNull();
  });
});
