import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { CaslModule } from '../casl/casl.module';
import { OrgService } from '../org/org.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserType } from './models/user.type';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserRolver', () => {
  let resolver: UserResolver;
  const database = [
    {
      id: '1',
      username: 'Ariel',
    },
  ];

  const mockUserService = {
    database,
    createUser: jest.fn((dto) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = dto;
      return result;
    }),
    listUsers: jest.fn(() => {
      return database;
    }),
    findOne: jest.fn((id) => {
      return database.find((user) => user.id === id);
    }),
  };
  const mockOrgService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CaslModule],
      providers: [
        UserResolver,
        { provide: UserService, useValue: mockUserService },
        { provide: OrgService, useValue: mockOrgService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('calls UserService.createUser and returns a UserType', async () => {
      const createUserInput: CreateUserInput = {
        username: 'ariel',
        password: '1234',
        firstName: 'Ariel',
        lastName: 'Veron',
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = createUserInput;

      expect(resolver.createUser(createUserInput)).toEqual(result);
      expect(mockUserService.createUser).toHaveBeenCalled();
    });
  });

  describe('users', () => {
    it('call UserService.listUsers and throw an unauthorized error', async () => {
      const user: JwtPayload = {
        id: 'someId',
        username: 'ariel',
        isAdmin: false,
        isHopeCreator: false,
      };

      expect(() => {
        resolver.users(user);
      }).toThrowError('Unauthorized');
    });

    it('call UserService.listUsers and return a list of users', async () => {
      const user: JwtPayload = {
        id: 'someId',
        username: 'ariel',
        isAdmin: true,
        isHopeCreator: false,
      };

      expect(resolver.users(user)).toEqual([
        {
          id: '1',
          username: 'Ariel',
        },
      ]);
    });
  });

  describe('user', () => {
    it('call UserService.findOne and return a user by id', async () => {
      const expectedUser = {
        id: '1',
        username: 'Ariel',
      };

      await expect(resolver.user('1')).resolves.toEqual(expectedUser);
    });

    it('call UserService.findOne and throw a user not found error', async () => {
      await expect(resolver.user('invalid')).rejects.toEqual(
        new Error('The user "invalid" was not found'),
      );
    });
  });

  describe('orgOwnerOf', () => {
    it('should pass a user without a valid orgOwnerOf field and return a empty array', async () => {
      let user = {};
      await expect(
        resolver.orgOwnerOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = null;
      await expect(
        resolver.orgOwnerOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = { orgOwnerOf: null };
      await expect(
        resolver.orgOwnerOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = { orgOwnerOf: '' };
      await expect(
        resolver.orgOwnerOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = { anyField: '' };
      await expect(
        resolver.orgOwnerOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = { orgOwnerOf: [] };
      await expect(
        resolver.orgOwnerOf(user as UserType),
      ).resolves.toStrictEqual([]);
    });
  });

  describe('hopeCreatorOf', () => {
    it('should pass a user without a valid hopeCreatorOf field and return a empty array', async () => {
      let user = {};
      await expect(
        resolver.hopeCreatorOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = null;
      await expect(
        resolver.hopeCreatorOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = { hopeCreatorOf: null };
      await expect(
        resolver.hopeCreatorOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = { hopeCreatorOf: '' };
      await expect(
        resolver.hopeCreatorOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = { anyField: '' };
      await expect(
        resolver.hopeCreatorOf(user as UserType),
      ).resolves.toStrictEqual([]);
      user = { hopeCreatorOf: [] };
      await expect(
        resolver.hopeCreatorOf(user as UserType),
      ).resolves.toStrictEqual([]);
    });
  });
});
