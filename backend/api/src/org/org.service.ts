import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrgInput } from './dto/create-org.input';
import { Org } from './models/org.entity';
import { v4 as uuid } from 'uuid';
import { User } from '../user/models/user.entity';
import { CurrentDateTime } from '../util/date.helpers';
import { UserService } from '../user/user.service';
import { LinkOrgField } from '../util/org.enum';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { LinkOrgToUsers } from './dto/link-org-users.input';

@Injectable()
export class OrgService {
  private logger = new Logger('Org Service');

  constructor(
    @InjectRepository(Org) private orgRepository: Repository<Org>,
    private userService: UserService,
  ) {}

  async findOne(id: string): Promise<Org> {
    return this.orgRepository.findOne({ id });
  }

  async getOrgs(): Promise<Org[]> {
    const orgs: Org[] = await this.orgRepository.find();
    return orgs;
  }

  async createOrg(
    createOrgInput: CreateOrgInput,
    user: JwtPayload,
  ): Promise<Org> {
    const { orgName, owners, hopeCreators } = createOrgInput;

    const orgId: string = uuid();

    const org: Org = {
      _id: null,
      id: orgId,
      orgName,
      owners: await this.linkUsersToOrgField(
        orgId,
        owners,
        LinkOrgField.Owners,
      ),
      hopeCreators: await this.linkUsersToOrgField(
        orgId,
        hopeCreators,
        LinkOrgField.HopeCreators,
      ),
      enabled: true,
      createdBy: user.id,
      createdAt: CurrentDateTime(),
    };

    const createdOrg = this.orgRepository.create(org);
    return this.orgRepository.save(createdOrg);
  }

  async linkOrgToUsers(linkOrgToUsers: LinkOrgToUsers): Promise<Org> {
    const { orgId, owners, hopeCreators } = linkOrgToUsers;

    let orgToUpdate: Org = await this.findOne(orgId);
    orgToUpdate = {
      ...orgToUpdate,
      owners: [
        ...orgToUpdate.owners,
        ...(await this.linkUsersToOrgField(orgId, owners, LinkOrgField.Owners)),
      ],
      hopeCreators: [
        ...orgToUpdate.hopeCreators,
        ...(await this.linkUsersToOrgField(
          orgId,
          hopeCreators,
          LinkOrgField.HopeCreators,
        )),
      ],
    };

    return this.orgRepository.save(orgToUpdate);
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

  // Link users to fields

  async linkUsersToOrgField(
    orgId: string,
    userList: string[],
    field: LinkOrgField,
  ): Promise<string[]> {
    const validUsers = await this.getValidUsers(userList);

    const validUsersIdList: string[] = [];
    if (!validUsers || validUsers?.length === 0) return validUsersIdList;

    for (const user of validUsers) {
      let userToSave: User;

      switch (field) {
        case LinkOrgField.Owners:
          userToSave = this.setUserAsOrgOwner(user, userToSave, orgId);
          break;
        case LinkOrgField.HopeCreators:
          userToSave = this.setUserAsOrgHopeCreator(user, userToSave, orgId);
          break;
      }

      await this.userService.save(userToSave);
      validUsersIdList.push(userToSave.id);
    }
    return validUsersIdList;
  }

  setUserAsOrgOwner(user: User, userToSave: User, orgId: string): User {
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

    return userToSave;
  }

  setUserAsOrgHopeCreator(user: User, userToSave: User, orgId: string): User {
    if (user.hopeCreatorOf === undefined || user.hopeCreatorOf === null) {
      userToSave = {
        ...user,
        hopeCreatorOf: [orgId],
      };
    } else if (!(orgId in user?.hopeCreatorOf)) {
      userToSave = {
        ...user,
        hopeCreatorOf: [...user.hopeCreatorOf, orgId],
      };
    }

    return userToSave;
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
