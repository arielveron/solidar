import { Test, TestingModule } from '@nestjs/testing';
import { CaslModule } from '../casl/casl.module';
import { OrgService } from '../org/org.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UsersRolver', () => {
  let resolver: UserResolver;
  const mockUserService = {
    createUser: jest.fn((dto) => {
      const { password, ...result } = dto;
      return result;
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
});
