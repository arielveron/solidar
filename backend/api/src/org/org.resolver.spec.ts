import { Test } from '@nestjs/testing';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { UserService } from '../user/user.service';
import { CreateOrgInput } from './dto/create-org.input';
import { OrgType } from './models/org.type';
import { OrgResolver } from './org.resolver';
import { OrgService } from './org.service';
import { RelationOrgToUsers } from './dto/relation-org-users.input';

describe('', () => {
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
  });
});
