import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrgInput } from './dto/create-org.input';
import { Org } from './models/org.entity';
import { v4 as uuid } from 'uuid';
import { User } from '../user/models/user.entity';
import { CurrentDateTime } from '../util/date.helpers';
import { UserService } from '../user/user.service';

@Injectable()
export class OrgService {
  private logger = new Logger('Org Service');

  constructor(
    @InjectRepository(Org) private orgRepository: Repository<Org>,
    private userService: UserService,
  ) {}

  async getOrgs(): Promise<Org[]> {
    const orgs: Org[] = await this.orgRepository.find();
    return orgs;
  }

  async createOrg(createOrgInput: CreateOrgInput, user: User): Promise<Org> {
    const { orgName, owners, hopeCreators } = createOrgInput;

    const org: Org = {
      _id: null,
      id: uuid(),
      orgName,
      owners: await this.linkUsers(owners),
      hopeCreators: await this.linkUsers(hopeCreators),
      enabled: true,
      createdBy: user.id,
      createdAt: CurrentDateTime(),
    };

    const createdOrg = this.orgRepository.create(org);
    return this.orgRepository.save(createdOrg);
  }

  /// Link Org to Users
  async linkUsers(userList: string[]): Promise<string[]> {
    userList.forEach(async (userId) => {
      const foundUser: User = await this.userService.findOne(userId);
      if (!foundUser) throw new BadRequestException(`User ${userId} Not found`);

      return foundUser.id;
    });

    return userList;
  }
}
