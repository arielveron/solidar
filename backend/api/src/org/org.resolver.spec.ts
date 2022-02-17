import { Test } from '@nestjs/testing';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { UserService } from '../user/user.service';
import { Org } from './models/org.entity';
import { OrgResolver } from './org.resolver';
import { OrgService } from './org.service';

describe('', () => {
  let resolver: OrgResolver;

  const orgDatabase = [
    {
      _id: 'someDBId',
      id: '1',
      orgName: 'Org 1',
      owners: ['1'],
      hopeCreators: [],
      enabled: true,
      createdAt: '2022-10-01',
      createdBy: '1',
    },
  ];

  const mockOrgService = {
    getOrgs: jest.fn(() => orgDatabase),
  };
  const mockUserService = {};
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
      const expectedOrgs: Org[] = [
        {
          _id: expect.any(String),
          id: '1',
          orgName: 'Org 1',
          owners: ['1'],
          hopeCreators: [],
          enabled: true,
          createdAt: '2022-10-01',
          createdBy: '1',
        },
      ];

      expect(resolver.orgs()).toEqual(expectedOrgs);
    });
  });
});
