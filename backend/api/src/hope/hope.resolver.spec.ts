import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { HopeResolver } from './hope.resolver';
import { HopeService } from './hope.service';
import { OrgService } from '../org/org.service';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { CreateHopeInput } from './dto/create-hope.input';

describe('HopeResolver', () => {
  let resolver: HopeResolver;

  const database = [{ id: '1', title: 'valid hope' }];
  const mockHopeService = {
    getHope: jest.fn((id: string) => {
      const result = database.find((hope) => hope.id === id);
      return result;
    }),
    getHopes: jest.fn(() => {
      return database;
    }),
    createHope: jest.fn((createHopeInput, user) => {
      const createdHope = {
        id: user.id,
        ...createHopeInput,
        createdBy: user.id,
      };
      return createdHope;
    }),
  };
  const mockCaslAbilityFactory = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkPolicy: jest.fn((user, action, hope) => {
      return true;
    }),
  };
  const mockUserService = {
    findOne: jest.fn((userId) => {
      switch (userId) {
        case '1':
          return {
            id: '1',
            username: 'ariel',
            isAdmin: true,
            orgOwnerOf: ['123123'],
          };
        case '2':
          return {
            id: '1',
            username: 'eduardo',
            isAdmin: true,
            hopeCreatorOf: ['124124'],
          };
      }
      return null;
    }),
  };
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
    it('should call Hope with "bogus" as an id and throw an error', async () => {
      const user: JwtPayload = {
        id: '1',
        username: 'ariel',
        isAdmin: true,
        isHopeCreator: true,
      };

      await expect(resolver.hope('bogus', user)).rejects.toEqual(
        new Error('The hope "bogus" was not found'),
      );
    });
  });

  describe('getHopes', () => {
    it('should call getHopes and return all hopes in DB', async () => {
      const user: JwtPayload = {
        id: '1',
        username: 'ariel',
        isAdmin: true,
        isHopeCreator: true,
      };
      const expectedHopes = [{ id: '1', title: 'valid hope' }];

      await expect(resolver.hopes(user)).resolves.toEqual(expectedHopes);
    });
  });

  describe('createHope', () => {
    it('should receive a new hope and return the created hope', async () => {
      const hope1: CreateHopeInput = {
        subject: 'New hope',
        description: 'New hope',
        forOrg: '123123',
      };
      const user1: JwtPayload = {
        id: '1',
        username: 'ariel',
        isAdmin: true,
        isHopeCreator: true,
      };
      const expectedHope1 = {
        id: '1',
        createdBy: '1',
        description: 'New hope',
        forOrg: '123123',
        subject: 'New hope',
      };

      await expect(resolver.createHope(hope1, user1)).resolves.toEqual(
        expectedHope1,
      );
      const hope2: CreateHopeInput = {
        subject: 'New hope 2',
        description: 'New hope 2',
        forOrg: '124124',
      };
      const user2: JwtPayload = {
        id: '2',
        username: 'eduardo',
        isAdmin: true,
        isHopeCreator: true,
      };
      const expectedHope2 = {
        id: '2',
        createdBy: '2',
        description: 'New hope 2',
        forOrg: '124124',
        subject: 'New hope 2',
      };

      await expect(resolver.createHope(hope2, user2)).resolves.toEqual(
        expectedHope2,
      );
    });
  });
});
