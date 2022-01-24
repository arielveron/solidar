import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UserService } from './user.service';
describe('UserService', () => {
  let service: UserService;
  const mockUserRepository = {};

  // more info on testing:
  // https://blog.logrocket.com/unit-testing-nestjs-applications-with-jest/

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getValidUsers', () => {
    it('should return an empty array', async () => {
      let userList = null;
      await expect(service.getValidUsers(userList)).resolves.toHaveLength(0);
      userList = 'test';
      await expect(service.getValidUsers(userList)).resolves.toHaveLength(0);
      userList = 32;
      await expect(service.getValidUsers(userList)).resolves.toHaveLength(0);
      userList = [];
      await expect(service.getValidUsers(userList)).resolves.toHaveLength(0);
    });
  });
});
