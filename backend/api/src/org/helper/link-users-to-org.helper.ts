import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { User } from '../../user/models/user.entity';
import { LinkOrgField } from '../../util/org.enum';

@Injectable()
export class LinkUsersOrgHelper {
  constructor(private userService: UserService) {}

  async resolveOwners(
    orgId: string,
    currentOwners: string[],
    ownersToLink: string[],
  ): Promise<string[]> {
    const unexistentOwners: string[] = ownersToLink.filter(
      (user) => !currentOwners.includes(user),
    );

    let ownersFinal = [...currentOwners];

    if (currentOwners?.length > 0 && unexistentOwners.length > 0) {
      ownersFinal = [
        ...ownersFinal,
        ...(await this.toField(orgId, unexistentOwners, LinkOrgField.Owners)),
      ];
    }

    return ownersFinal;
  }

  async toField(
    orgId: string,
    userList: string[],
    field: LinkOrgField,
  ): Promise<string[]> {
    const validUsers = await this.userService.getValidUsers(userList);

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
}
