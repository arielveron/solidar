import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  ForbiddenError,
  InferSubjects,
} from '@casl/ability';
import { Logger } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Action } from './actions/action.enum';
import { Hope } from '../hope/models/hope.entity';
import { User } from '../user/models/user.entity';
import { JwtPayload } from 'src/auth/dto/jwt.payload';

export type Subjects = InferSubjects<typeof Hope | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  private logger = new Logger('CASL Factory');

  createForUser(user: JwtPayload) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Create, Hope); // WARNING! permission reserved to managers of ORGs. Replace after capability created

      can(Action.Read, Hope);
      can(Action.Update, Hope, { createdBy: user.id });

      cannot(Action.Read, Hope, {
        isPublished: false,
        createdBy: { $ne: user.id },
      }).because('Access denied');
    }

    cannot(Action.Delete, Hope, { isPublished: true });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  checkPolicy(user: JwtPayload, action: Action, subject: Subjects) {
    const ability = this.createForUser(user);

    try {
      ForbiddenError.from(ability).throwUnlessCan(action, subject);
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        this.logger.verbose(
          `User "${
            user.username
          }" was denied to read Subject: "${JSON.stringify(subject)}"`,
        );
        throw new ForbiddenException(error.message);
      }
    }
  }
}
