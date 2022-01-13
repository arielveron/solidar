import { Injectable, Logger } from '@nestjs/common';
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

    const orgId: string = uuid();

    const org: Org = {
      _id: null,
      id: orgId,
      orgName,
      owners: await this.linkUsersToOwners(orgId, owners),
      // hopeCreators: await this.linkUsersToHopeCreators(orgId, hopeCreators),
      hopeCreators,
      enabled: true,
      createdBy: user.id,
      createdAt: CurrentDateTime(),
    };

    const createdOrg = this.orgRepository.create(org);
    return this.orgRepository.save(createdOrg);
  }

  async getManyOrgs(orgIds: string[]): Promise<Org[]> {
    return this.orgRepository.find({
      where: {
        id: {
          $in: orgIds,
        },
      },
    });
  }

  /// Link Org to Users
  async linkUsersToOwners(
    orgId: string,
    userList: string[],
  ): Promise<string[]> {
    const validUsers = await this.getValidUsers(userList);

    const validUsersIdList: string[] = [];
    if (!validUsers || validUsers?.length === 0) return validUsersIdList;

    for (const user of validUsers) {
      let userToSave: User;

      if (user.orgOwnerOf === undefined || user.orgOwnerOf === null) {
        userToSave = {
          ...user,
          orgOwnerOf: [orgId],
        };
      } else if (!(orgId in user?.orgOwnerOf)) {
        userToSave = {
          ...user,
          orgOwnerOf: [...user.orgOwnerOf, orgId],
        };
      }
      await this.userService.save(userToSave);
      validUsersIdList.push(userToSave.id);
    }
    return validUsersIdList;
  }

  async linkUsersToHopeCreators(
    orgId: string,
    userList: string[],
  ): Promise<string[]> {
    console.log('linkUsersToHope');
    const validUsers = await this.getValidUsers(userList);

    let validUsersIdList: string[];
    if (!validUsers || validUsersIdList?.length === 0) return validUsersIdList;

    for (const user of validUsers) {
      if (!(orgId in user.hopeCreatorOf)) {
        const userToSave: User = {
          hopeCreatorOf: [...user.hopeCreatorOf, orgId],
          ...user,
        };
        await this.userService.save(userToSave);
      }
      validUsersIdList.push(user.id);
    }
    return validUsersIdList;
  }

  async getValidUsers(userList: string[]): Promise<User[]> {
    const validUsers: User[] = [];
    if (!userList || userList?.length === 0) return validUsers;

    for (const userId of userList) {
      const foundUser: User = await this.userService.findOne(userId);

      if (foundUser) {
        validUsers.push(foundUser);
      }
    }

    return validUsers;
  }
}
