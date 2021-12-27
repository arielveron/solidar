import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserInput } from '../dto/login-user.input';

// don't forget to add this local strategy as a provider in auth.module.ts
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private configService: ConfigService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs().loginUserInput;
    return request;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = new Logger('Local Strategy');
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();

    try {
      await super.canActivate(context);
      return true;
    } catch (e) {
      const loginUserInput: LoginUserInput = request.body;

      logger.warn(
        `Failed login. Username: "${this.trimStringToLenght(
          loginUserInput?.username,
          this.configService.get('USERNAME_MAXLENGTH_TO_LOG'),
        )}" - IP ${request.req.ip}`,
      );
      throw new UnauthorizedException();
    }
  }

  trimStringToLenght(str: string, desiredLength: number): string {
    const strLength: number = str.length;

    if (strLength <= desiredLength) {
      return str;
    }
    const trimmedStr: string = str.substring(0, desiredLength);
    return `${trimmedStr}...[+${strLength - desiredLength} chars]`;
  }
}
