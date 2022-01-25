import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UserService } from './user.service';
describe('UserService', () => {
  let service: UserService;
  const database = [
    {
      id: '1',
      username: 'ariel',
    },
    {
      id: '2',
      username: 'eduardo',
    },
    {
      id: '3',
      username: 'veron',
    },
  ];

  const mockUserRepository = {
    database,
    findOne: jest.fn((ids) => {
      const result = database.find((user) => user.id === ids.id);
      return result;
    }),
  };

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
      userList = {
        constructor() {
          return;
        },
      };
      await expect(service.getValidUsers(userList)).resolves.toHaveLength(0);
    });

    it('should accept a list of a single valid Id and return it as a single valid user', async () => {
      const userList = ['1'];
      const expectedUser = [
        {
          id: '1',
          username: 'ariel',
        },
      ];
      await expect(service.getValidUsers(userList)).resolves.toStrictEqual(
        expectedUser,
      );
    });

    it('should accept a list of a mixed valid and invalid Id and return it with only the valid users', async () => {
      let userList = ['1', '2'];
      const expectedUser = [
        {
          id: '1',
          username: 'ariel',
        },
        {
          id: '2',
          username: 'eduardo',
        },
      ];
      await expect(service.getValidUsers(userList)).resolves.toStrictEqual(
        expectedUser,
      );
      userList = ['1', '2', 'invalid'];
      await expect(service.getValidUsers(userList)).resolves.toStrictEqual(
        expectedUser,
      );
    });
  });
});
