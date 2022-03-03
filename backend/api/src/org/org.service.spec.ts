import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LinkUsersOrgHelper } from './helper/link-users-to-org.helper';
import { UnlinkUsersOrgHelper } from './helper/unlink-users-from-org.helper';
import { Org } from './models/org.entity';
import { OrgService } from './org.service';

describe('OrgService', () => {
  let service: OrgService;

  const mockOrgRepository = {};
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
});
