import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserType } from '../user/models/user.type';
import { CreateOrgInput } from './dto/create-org.input';
import { LinkUsersOrgHelper } from './helper/link-users-to-org.helper';
import { UnlinkUsersOrgHelper } from './helper/unlink-users-from-org.helper';
import { Org } from './models/org.entity';
import { OrgService } from './org.service';
import { LinkOrgField } from '../util/org.enum';

describe('OrgService', () => {
  let service: OrgService;

  const mockOrgRepository = {
    findOne: jest.fn((org) => {
      const { id } = org;
      if (id === '1')
        return {
          _id: 'dbId',
          id: '1',
          orgName: 'Org name',
          owners: ['1'],
          hopeCreators: [],
          enabled: true,
          createdBy: '1',
          createdAt: '2022-03-03T21:51:00',
        };
      return null;
    }),
    find: jest.fn(() => {
      return [
        {
          _id: 'dbId',
          id: '1',
          orgName: 'Org name',
          owners: ['1'],
          hopeCreators: [],
          enabled: true,
          createdBy: '1',
          createdAt: '2022-03-03T21:51:00',
        },
      ];
    }),
    create: jest.fn((org) => {
      return { ...org, _id: 'someId' };
    }),
    save: jest.fn((org) => {
      return org;
    }),
  };
  const mockLinkUsersOrgHelper = {
    toField: jest.fn((orgId, userList, field: LinkOrgField) => {
      if (field === LinkOrgField.Owners) return userList;
      else return [];
    }),
  };
  const mockUnlinkUsersOrgHelper = {};

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrgService,
        { provide: getRepositoryToken(Org), useValue: mockOrgRepository },
        { provide: LinkUsersOrgHelper, useValue: mockLinkUsersOrgHelper },
        { provide: UnlinkUsersOrgHelper, useValue: mockUnlinkUsersOrgHelper },
      ],
    }).compile();

    service = module.get(OrgService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should call findOne with a valid id and return a valid org', async () => {
      const expectedOrg: Org = {
        _id: expect.any(String),
        id: '1',
        orgName: 'Org name',
        owners: ['1'],
        hopeCreators: [],
        enabled: true,
        createdBy: '1',
        createdAt: expect.any(String),
      };

      await expect(service.findOne('1')).resolves.toEqual(expectedOrg);
    });

    it('should call findOne with an invalid id and return undefined', async () => {
      const expectedOrg = null;

      await expect(service.findOne('2')).resolves.toEqual(expectedOrg);
      await expect(service.findOne('')).resolves.toEqual(expectedOrg);
      await expect(service.findOne(null)).resolves.toEqual(expectedOrg);
    });
  });

  describe('getOrgs', () => {
    it('should call getOrgs without params and return the existing orgs', async () => {
      const expectedOrgs = [
        {
          _id: expect.any(String),
          id: '1',
          orgName: 'Org name',
          owners: ['1'],
          hopeCreators: [],
          enabled: true,
          createdBy: '1',
          createdAt: expect.any(String),
        },
      ];

      await expect(service.getOrgs()).resolves.toEqual(expectedOrgs);
    });
  });

  describe('createOrg', () => {
    it('should call createOrg with valid org and user and return the created org', async () => {
      const expectedOrg = {
        _id: expect.any(String),
        id: expect.any(String),
        orgName: 'ABC',
        owners: ['1'],
        hopeCreators: [],
        enabled: true,
        createdBy: '1',
        createdAt: expect.any(String),
      };
      const createOrgInput: CreateOrgInput = {
        orgName: 'ABC',
        owners: ['1'],
        hopeCreators: [],
      };
      const user: UserType = {
        id: '1',
        username: 'ariel',
        firstName: 'Ariel',
        lastName: 'Veron',
        isAdmin: true,
        orgOwnerOf: ['1'],
        hopeCreatorOf: [],
      };

      await expect(service.createOrg(createOrgInput, user)).resolves.toEqual(
        expectedOrg,
      );
    });
  });
});
