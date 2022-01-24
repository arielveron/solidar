import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { CaslModule } from '../casl/casl.module';
import { OrgService } from '../org/org.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './models/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UsersRolver', () => {
  let resolver: UserResolver;
  const mockUserService = {
    createUser: jest.fn((dto) => {
      const { password, ...result } = dto;
      return result;
    }),
    listUsers: jest.fn(() => {
      return [
        {
          username: 'Ariel',
        },
      ];
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
          username: 'Ariel',
        },
      ]);
    });
  });
});
