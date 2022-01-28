import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { HopeResolver } from './hope.resolver';
import { HopeService } from './hope.service';
import { OrgService } from '../org/org.service';
import { JwtPayload } from '../auth/dto/jwt.payload';

describe('HopeResolver', () => {
  let resolver: HopeResolver;

  const mockHopeService = {
    getHope: jest.fn(() => {
      return { id: '1', title: 'valid hope' };
    }),
  };
  const mockCaslAbilityFactory = {
    checkPolicy: jest.fn((user, action, hope) => {
      return true;
    }),
  };
  const mockUserService = {};
  const mockOrgService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HopeResolver,
        { provide: HopeService, useValue: mockHopeService },
        { provide: CaslAbilityFactory, useValue: mockCaslAbilityFactory },
        { provide: UserService, useValue: mockUserService },
        { provide: OrgService, useValue: mockOrgService },
      ],
    }).compile();

    resolver = module.get<HopeResolver>(HopeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('hope', () => {
    it('should call Hope with "1" as an id and return a valid hope', async () => {
      const expectedHope = {
        id: '1',
        title: 'valid hope',
      };
      const user: JwtPayload = {
        id: '2321',
        username: 'ariel',
        isAdmin: true,
        isHopeCreator: true,
      };

      await expect(resolver.hope('1', user)).resolves.toEqual(expectedHope);
    });
  });
});
