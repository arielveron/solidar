import { Test } from '@nestjs/testing';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { UserService } from '../user/user.service';
import { CreateOrgInput } from './dto/create-org.input';
import { OrgType } from './models/org.type';
import { OrgResolver } from './org.resolver';
import { OrgService } from './org.service';
import { RelationOrgToUsers } from './dto/relation-org-users.input';
import { UserType } from '../user/models/user.type';

describe('OrgResolver', () => {
  let resolver: OrgResolver;

  const orgDatabase: OrgType[] = [
    {
      id: '1',
      orgName: 'Org 1',
      owners: ['1'],
      hopeCreators: [],
      enabled: true,
    },
  ];

  const mockOrgService = {
    getOrgs: jest.fn(() => orgDatabase),
    createOrg: jest.fn(
      async (createOrgInput: CreateOrgInput, user: JwtPayload) => {
        const result: OrgType = {
          id: '1',
          orgName: createOrgInput.orgName,
          owners: [...createOrgInput.owners],
          hopeCreators: [...createOrgInput.hopeCreators],
          enabled: true,
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const willUsedForCreatedByFied = user;

        return result;
      },
    ),
    linkOrgToUsers: jest.fn((relationOrgToUsers: RelationOrgToUsers) => {
      const result: OrgType = {
        id: '1',
        orgName: 'Org 1',
        owners: [...relationOrgToUsers.owners],
        hopeCreators: [...relationOrgToUsers.hopeCreators],
        enabled: true,
      };
      return result;
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unlinkOrgFromUsers: jest.fn((relationOrgToUsers: RelationOrgToUsers) => {
      const result: OrgType = {
        id: '1',
        orgName: 'Org 1',
        owners: [],
        hopeCreators: [],
        enabled: true,
      };
      return result;
    }),
  };
  const mockUserService = {
    findOne: jest.fn((user: JwtPayload) => {
      return user;
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getManyUsers: jest.fn((user) => {
      if (user.toString() === ['1'].toString()) {
        return [
          {
            id: '1',
            firstName: 'Ariel',
            lastName: 'Veron',
            username: 'ariel',
            orgOwnerOf: ['1'],
            hopeCreatorOf: [],
            isAdmin: false,
          },
        ];
      } else if (user.toString() === ['2'].toString()) {
        return [
          {
            id: '2',
            firstName: 'Ariel',
            lastName: 'Veron',
            username: 'ariel',
            orgOwnerOf: [],
            hopeCreatorOf: ['1'],
            isAdmin: false,
          },
        ];
      } else {
        return [];
      }
    }),
  };
  const mockCaslAbilityFactory = {};

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrgResolver,
        { provide: UserService, useValue: mockUserService },
        { provide: OrgService, useValue: mockOrgService },
        { provide: CaslAbilityFactory, useValue: mockCaslAbilityFactory },
      ],
    }).compile();
    resolver = module.get(OrgResolver);
  });

  it('should be defined', async () => {
    expect(resolver).toBeDefined();
  });

  describe('Orgs', () => {
    it('should call Orgs without arguments and must return all orgs', () => {
      const expectedOrgs: OrgType[] = [
        {
          id: '1',
          orgName: 'Org 1',
          owners: ['1'],
          hopeCreators: [],
          enabled: true,
        },
      ];

      expect(resolver.orgs()).toEqual(expectedOrgs);
    });
  });

  describe('CreateOrg', () => {
    it('should call createOrg with a valid createOrgInput and authorized user, must return valid new Org', async () => {
      const expectedOrg: OrgType = {
        id: '1',
        orgName: 'Org new',
        owners: ['1'],
        hopeCreators: [],
        enabled: true,
      };

      const createOrgInput: CreateOrgInput = {
        orgName: 'Org new',
        owners: ['1'],
        hopeCreators: [],
      };

      const user: JwtPayload = {
        id: '1',
        username: 'ariel',
        isAdmin: false,
        isHopeCreator: false,
      };

      await expect(resolver.createOrg(createOrgInput, user)).resolves.toEqual(
        expectedOrg,
      );
    });

    describe('linkOrgToUsers', () => {
      it('should call to linkOrgToUsers with a valid Org id and valid User ID as owners and must return an Org with that user attached as owner', () => {
        const expectedOrg: OrgType = {
          id: '1',
          orgName: 'Org 1',
          owners: ['1'],
          hopeCreators: [],
          enabled: true,
        };
        const relationOrgToUsers: RelationOrgToUsers = {
          orgId: '1',
          owners: ['1'],
          hopeCreators: [],
        };

        expect(resolver.linkOrgToUsers(relationOrgToUsers)).toEqual(
          expectedOrg,
        );
      });
    });

    describe('unlinkOrgFromUsers', () => {
      it('should call to unlinkOrgFromUsers with a valid Org id and valid User ID as owner and must return and Org with that user detached', () => {
        const expectedOrg: OrgType = {
          id: '1',
          orgName: 'Org 1',
          owners: [],
          hopeCreators: [],
          enabled: true,
        };
        const relationOrgToUsers: RelationOrgToUsers = {
          orgId: '1',
          owners: ['1'],
          hopeCreators: [],
        };

        expect(resolver.unlinkOrgFromUsers(relationOrgToUsers)).toEqual(
          expectedOrg,
        );
      });
    });

    describe('Owners - Resolver field', () => {
      it('should call owners to get all owners listed in GraphQL field with valid owners list and must return owners (users) list', async () => {
        const expectedOwners: UserType[] = [
          {
            id: '1',
            firstName: 'Ariel',
            lastName: 'Veron',
            username: 'ariel',
            orgOwnerOf: ['1'],
            hopeCreatorOf: [],
            isAdmin: false,
          },
        ];
        const org: OrgType = {
          id: '1',
          orgName: 'Org 1',
          owners: ['1'],
          hopeCreators: [],
          enabled: true,
        };
        await expect(resolver.owners(org)).resolves.toEqual(expectedOwners);
      });

      it('should call owners to get all owners listed in GraphQL field with invalid owners list and must return an empty array', async () => {
        const expectedOwners: [] = [];
        const org: OrgType = {
          id: '1',
          orgName: 'Org 1',
          owners: [],
          hopeCreators: [],
          enabled: true,
        };
        await expect(resolver.owners(org)).resolves.toEqual(expectedOwners);

        const org2 = {
          id: '1',
          orgName: 'Org 1',
          owners: '1',
          hopeCreators: [],
          enabled: true,
        };
        await expect(
          resolver.owners(org2 as unknown as OrgType),
        ).resolves.toEqual(expectedOwners);

        const org3 = {
          id: '1',
          orgName: 'Org 1',
          hopeCreators: [],
          enabled: true,
        };
        await expect(resolver.owners(org3 as OrgType)).resolves.toEqual(
          expectedOwners,
        );
      });
    });

    describe('hopeCreators - Resolver field', () => {
      it('should call hopeCreators to get all hope creators listed in GraphQL field with valid hope creators list and must return users list', async () => {
        const expectedHopeCreators: UserType[] = [
          {
            id: '2',
            firstName: 'Ariel',
            lastName: 'Veron',
            username: 'ariel',
            orgOwnerOf: [],
            hopeCreatorOf: ['1'],
            isAdmin: false,
          },
        ];
        const org: OrgType = {
          id: '1',
          orgName: 'Org 1',
          owners: [],
          hopeCreators: ['2'],
          enabled: true,
        };
        await expect(resolver.hopeCreators(org)).resolves.toEqual(
          expectedHopeCreators,
        );
      });
    });

    it('should call hopeCreators to get all hopeCreators listed in GraphQL field with invalid hopeCreators list and must return an empty array', async () => {
      const expectedHopeCreators: [] = [];
      const org: OrgType = {
        id: '1',
        orgName: 'Org 1',
        owners: [],
        hopeCreators: [],
        enabled: true,
      };
      await expect(resolver.hopeCreators(org)).resolves.toEqual(
        expectedHopeCreators,
      );

      const org2 = {
        id: '1',
        orgName: 'Org 1',
        owners: [],
        hopeCreators: '1',
        enabled: true,
      };
      await expect(
        resolver.hopeCreators(org2 as unknown as OrgType),
      ).resolves.toEqual(expectedHopeCreators);

      const org3 = {
        id: '1',
        orgName: 'Org 1',
        owners: [],
        enabled: true,
      };
      await expect(resolver.hopeCreators(org3 as OrgType)).resolves.toEqual(
        expectedHopeCreators,
      );
    });
  });
});
