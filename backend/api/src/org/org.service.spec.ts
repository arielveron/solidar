import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LinkUsersOrgHelper } from './helper/link-users-to-org.helper';
import { UnlinkUsersOrgHelper } from './helper/unlink-users-from-org.helper';
import { Org } from './models/org.entity';
import { OrgService } from './org.service';

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
  };
  const mockLinkUsersOrgHelper = {};
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
});
