import { Test, TestingModule } from '@nestjs/testing';
import { CaslModule } from '../casl/casl.module';
import { OrgService } from '../org/org.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UsersRolver', () => {
  let resolver: UserResolver;
  const mockUserService = () => ({});
  const mockOrgService = () => ({});

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CaslModule],
      providers: [
        UserResolver,
        { provide: UserService, useFactory: mockUserService },
        { provide: OrgService, useFactory: mockOrgService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
