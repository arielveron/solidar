import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { HopeResolver } from './hope.resolver';
import { HopeService } from './hope.service';
import { OrgService } from '../org/org.service';

describe('HopeResolver', () => {
  let resolver: HopeResolver;

  const mockHopeService = {};
  const mockCaslAbilityFactory = {};
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
});
