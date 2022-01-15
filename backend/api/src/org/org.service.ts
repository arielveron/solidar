import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrgInput } from './dto/create-org.input';
import { Org } from './models/org.entity';
import { v4 as uuid } from 'uuid';
import { CurrentDateTime } from '../util/date.helpers';
import { UserService } from '../user/user.service';
import { LinkOrgField } from '../util/org.enum';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { RelationOrgToUsers } from './dto/relation-org-users.input';
import { LinkUsersOrgHelper } from './helper/link-users-to-org-field.helper';
import { User } from 'src/user/models/user.entity';

@Injectable()
export class OrgService {
  private logger = new Logger('Org Service');

  constructor(
    @InjectRepository(Org) private orgRepository: Repository<Org>,
    private userService: UserService,
    private linkUsersOrgHelper: LinkUsersOrgHelper,
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
      owners: await this.linkUsersOrgHelper.toField(
        orgId,
        owners,
        LinkOrgField.Owners,
      ),
      hopeCreators: await this.linkUsersOrgHelper.toField(
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

  async linkOrgToUsers(relationOrgToUsers: RelationOrgToUsers): Promise<Org> {
    const { orgId, owners, hopeCreators } = relationOrgToUsers;

    let orgToUpdate: Org = await this.findOne(orgId);
    // code return if not found
    orgToUpdate = {
      ...orgToUpdate,
      owners: [
        ...orgToUpdate.owners,
        ...(await this.linkUsersOrgHelper.toField(
          orgId,
          owners,
          LinkOrgField.Owners,
        )),
      ],
      hopeCreators: [
        ...orgToUpdate.hopeCreators,
        ...(await this.linkUsersOrgHelper.toField(
          orgId,
          hopeCreators,
          LinkOrgField.HopeCreators,
        )),
      ],
    };

    return this.orgRepository.save(orgToUpdate);
  }

  async unlinkOrgFromUsers(
    relationOrgToUsers: RelationOrgToUsers,
  ): Promise<Org> {
    const { orgId, owners, hopeCreators } = relationOrgToUsers;

    let orgToUpdate: Org = await this.findOne(orgId);
    // code return if not found

    await this.removeFieldInUsers(orgId, owners, LinkOrgField.Owners);

    const newOwners = this.excludeOrgsFromUserField(
      orgToUpdate,
      owners,
      LinkOrgField.Owners,
    );

    orgToUpdate = {
      ...orgToUpdate,
      owners: newOwners,
    };

    return this.orgRepository.save(orgToUpdate);
  }

  // Remove array of users even whether they exist or not
  private excludeOrgsFromUserField(
    orgToUpdate: Org,
    owners: string[],
    field: LinkOrgField,
  ) {
    switch (field) {
      case LinkOrgField.Owners:
        if (orgToUpdate?.owners?.length > 0) {
          return orgToUpdate.owners.filter(
            (userId) => !owners.includes(userId),
          );
        }
    }
  }

  async removeFieldInUsers(
    orgId: string,
    userList: string[],
    field: LinkOrgField,
  ) {
    const validUsers = await this.userService.getValidUsers(userList);

    const validUsersIdList: string[] = [];
    if (!validUsers || validUsers?.length === 0) return validUsersIdList;

    for (const user of validUsers) {
      let userToSave: User;

      switch (field) {
        case LinkOrgField.Owners:
          userToSave = this.unsetUserFromOrgOwner(user, userToSave, orgId);
          break;
        // case LinkOrgField.HopeCreators:
        //   userToSave = this.setUserAsOrgHopeCreator(user, userToSave, orgId);
        //   break;
      }

      await this.userService.save(userToSave);
      validUsersIdList.push(userToSave.id);
    }
    return validUsersIdList;
  }

  unsetUserFromOrgOwner(user: User, userToSave: User, orgId: string): User {
    if (orgId in user?.orgOwnerOf) {
      userToSave = {
        ...user,
        orgOwnerOf: [
          ...user.orgOwnerOf.filter(
            (userId) => !user.orgOwnerOf.includes(userId),
          ),
        ],
      };
    }
    userToSave = {
      ...user,
    };
    return userToSave;
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
}
