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
      let result;
      if (ids.id) {
        result = database.find((user) => user.id === ids.id);
      } else if (ids.username) {
        result = database.find((user) => user.username === ids.username);
      }
      return result;
    }),
    find: jest.fn((filter) => {
      if (!filter) {
        return database;
      }
      if (JSON.stringify(filter) === '{"where":{"id":{"$in":["1"]}}}')
        return [database[0]];
      if (JSON.stringify(filter) === '{"where":{"id":{"$in":["1","2"]}}}')
        return [database[0], database[1]];
      return [];
    }),
    save: jest.fn((user) => {
      if (user.username === 'expecterror') {
        throw new Error('Test instructed to fail on save to database');
      }
      return user;
    }),
    create: jest.fn((user) => {
      return user;
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

  describe('createUser', () => {
    it('should call Service.createUser with "{username: "Ariel", password: "prueba", firstName: "Ariel", lastName: "Veron"}" and must return a valid new username"', async () => {
      const user = {
        username: 'Ariel',
        password: 'prueba',
        firstName: 'Ariel',
        lastName: 'Veron',
      };

      const expectedUser = {
        _id: null,
        id: expect.any(String),
        username: 'ariel',
        firstName: 'Ariel',
        lastName: 'Veron',
        orgOwnerOf: [],
        hopeCreatorOf: [],
        isAdmin: false,
        enabled: true,
        createdAt: expect.any(String),
      };
      await expect(service.createUser(user)).resolves.toEqual(expectedUser);
    });
    it('should call Service.createUser with username: "expectError" and must return an error"', async () => {
      const user = {
        username: 'expectError',
        password: 'prueba',
        firstName: 'Ariel',
        lastName: 'Veron',
      };

      await expect(service.createUser(user)).rejects.toEqual(
        new Error('Error saving to DB'),
      );
    });
  });

  describe('findOne', () => {
    it('should call Service.findOne with "1" and return a valid user', async () => {
      const expectedUser = {
        id: '1',
        username: 'ariel',
      };
      await expect(service.findOne('1')).resolves.toEqual(expectedUser);
    });
    it('should call Service.findOne with "bogus" and return undefined', async () => {
      const expectedUser = undefined;
      await expect(service.findOne('bogus')).resolves.toEqual(expectedUser);
    });
  });

  describe('findUsername', () => {
    it('should call Service.findUsername with "ariel" and return a valid username', async () => {
      const expectedUser = {
        id: '1',
        username: 'ariel',
      };
      await expect(service.findUsername('ariel')).resolves.toEqual(
        expectedUser,
      );
    });
    it('should call Service.findUsername with "bogus" and return a undefined user', async () => {
      const expectedUser = undefined;
      await expect(service.findUsername('bogus')).resolves.toEqual(
        expectedUser,
      );
    });
  });

  describe('listUsers', () => {
    it('should call UserService without parameters and return a list of users in database', async () => {
      const expectedUser = [
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

      await expect(service.listUsers()).resolves.toEqual(expectedUser);
    });
  });

  describe('save', () => {
    it('should call UserService.save and send an User & must return the sended user', async () => {
      const user = {
        id: '1',
        username: 'ariel',
      };
      const expectedUser = {
        id: '1',
        username: 'ariel',
      };

      await expect(service.save(user as User)).resolves.toEqual(expectedUser);
    });
  });

  describe('getManyUsers', () => {
    it('should call UserService.getManyUsers with ["1"] and return one valid user', async () => {
      const expectedUser = [{ id: '1', username: 'ariel' }];

      await expect(service.getManyUsers(['1'])).resolves.toEqual(expectedUser);
    });

    it('should call UserService.getManyUsers with ["1","2"] and return two valid user', async () => {
      const expectedUser = [
        { id: '1', username: 'ariel' },
        { id: '2', username: 'eduardo' },
      ];

      await expect(service.getManyUsers(['1', '2'])).resolves.toEqual(
        expectedUser,
      );
    });

    it('should call UserService.getManyUsers with ["1"] and return one valid user', async () => {
      const expectedUser = [{ id: '1', username: 'ariel' }];

      await expect(service.getManyUsers(['1'])).resolves.toEqual(expectedUser);
    });
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
