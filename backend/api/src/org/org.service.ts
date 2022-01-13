import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrgInput } from './dto/create-org.input';
import { Org } from './models/org.entity';
import { v4 as uuid } from 'uuid';
import { User } from '../user/models/user.entity';
import { CurrentDateTime } from '../util/date.helpers';

@Injectable()
export class OrgService {
  private logger = new Logger('Org Service');

  constructor(@InjectRepository(Org) private orgRepository: Repository<Org>) {}

  async getOrgs(): Promise<Org[]> {
    const orgs: Org[] = await this.orgRepository.find();
    return orgs;
  }

  createOrg(createOrgInput: CreateOrgInput, user: User): Promise<Org> {
    const { orgName, owners, hopeCreators } = createOrgInput;

    const org: Org = {
      _id: null,
      id: uuid(),
      orgName,
      owners,
      hopeCreators,
      enabled: true,
      createdBy: user.id,
      createdAt: CurrentDateTime(),
    };

    const createdOrg = this.orgRepository.create(org);
    return this.orgRepository.save(createdOrg);
  }

  /// Link Org to Users
}
