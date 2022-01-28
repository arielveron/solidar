import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { OrgModule } from '../org/org.module';
import { Org } from '../org/models/org.entity';
import { OrgService } from '../org/org.service';
import { User } from './models/user.entity';
import { UserModule } from './user.module';
import { UserResolver } from './user.resolver';

describe('UserModule', () => {
  let resolver: UserResolver;

  const mockUserRepository = {};
  const mockOrgRepository = {};
  const mockOrgService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrgModule, UserModule],
      providers: [
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Org), useValue: mockOrgRepository },
        { provide: OrgService, useValue: mockOrgService },
        UserResolver,
      ],
    }).compile();

    resolver = module.get(UserModule);
  });

  it('should Module be instantiated', () => {
    expect(resolver instanceof UserResolver).toBeTruthy();
  });
});
