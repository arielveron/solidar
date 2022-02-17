import { Test } from '@nestjs/testing';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { UserService } from '../user/user.service';
import { OrgResolver } from './org.resolver';
import { OrgService } from './org.service';

describe('', () => {
  let resolver: OrgResolver;

  const mockUserService = {};
  const mockOrgService = {};
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
});
