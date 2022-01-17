import { Injectable } from '@nestjs/common';
import { User } from '../../user/models/user.entity';
import { UserService } from '../../user/user.service';
import { LinkOrgField } from '../../util/org.enum';
import { Org } from '../models/org.entity';

@Injectable()
export class UnlinkUsersOrgHelper {
  constructor(private userService: UserService) {}

  async unlinkOwners(orgId: string, owners: string[], orgToUpdate: Org) {
    const newOwners = this.excludeUsersFromOrg(
      orgToUpdate,
      owners,
      LinkOrgField.Owners,
    );

    if (newOwners.length === 0) {
      throw new Error(
        'Removing the requested users will let this "Organization" without "Owners" and that is not allowed. Please insert another user as owner before removing this user.',
      );
    }

    orgToUpdate = {
      ...orgToUpdate,
      owners: newOwners,
    };

    await this.removeFieldInUsers(orgId, owners, LinkOrgField.Owners);

    return orgToUpdate;
  }

  async unlinkHopeCreators(
    orgId: string,
    hopeCreators: string[],
    orgToUpdate: Org,
  ) {
    const newHopeCreators = this.excludeUsersFromOrg(
      orgToUpdate,
      hopeCreators,
      LinkOrgField.HopeCreators,
    );

    orgToUpdate = {
      ...orgToUpdate,
      hopeCreators: newHopeCreators,
    };

    await this.removeFieldInUsers(
      orgId,
      hopeCreators,
      LinkOrgField.HopeCreators,
    );
    return orgToUpdate;
  }

  // Remove array of users even whether they exist or not
  private excludeUsersFromOrg(
    orgToUpdate: Org,
    userList: string[],
    field: LinkOrgField,
  ): string[] {
    switch (field) {
      case LinkOrgField.Owners:
        if (orgToUpdate?.owners?.length > 0) {
          return orgToUpdate.owners.filter(
            (userId) => !userList.includes(userId),
          );
        }

      case LinkOrgField.HopeCreators:
        if (orgToUpdate?.hopeCreators?.length > 0) {
          return orgToUpdate.hopeCreators.filter(
            (userId) => !userList.includes(userId),
          );
        }
    }
  }

  private async removeFieldInUsers(
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
        case LinkOrgField.HopeCreators:
          userToSave = this.unsetUserFromHopeCreator(user, userToSave, orgId);
          break;
      }

      await this.userService.save(userToSave);
      validUsersIdList.push(userToSave.id);
    }
    return validUsersIdList;
  }

  private unsetUserFromOrgOwner(
    user: User,
    userToSave: User,
    orgId: string,
  ): User {

    userToSave = {
      ...user,
    };

    if (user?.orgOwnerOf.includes(orgId)) {
      userToSave.orgOwnerOf = [
        ...user.orgOwnerOf.filter((org) => org !== orgId),
      ];
    }

    return userToSave;
  }

  private unsetUserFromHopeCreator(
    user: User,
    userToSave: User,
    orgId: string,
  ): User {
    if (orgId in user?.hopeCreatorOf) {
      userToSave = {
        ...user,
        hopeCreatorOf: [
          ...user.hopeCreatorOf.filter(
            (userId) => !user.hopeCreatorOf.includes(userId),
          ),
        ],
      };
    }
    userToSave = {
      ...user,
    };
    return userToSave;
  }
}
