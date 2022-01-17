import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user.entity';
import { RolesSet } from './dto/roles-set.dto';

@Injectable()
export class RolesService {
  set(user: User): RolesSet {
    const roles: RolesSet = {
      isHopeCreator: false,
    };

    if (user.orgOwnerOf?.length > 0 || user.hopeCreatorOf?.length > 0) {
      roles.isHopeCreator = true;
    }

    return roles;
  }
}
