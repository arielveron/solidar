# Authentication

## Authentication workflow
Solidar achieves authentication using the following technologies:
- NestJS
- Passport.JS
- GraphQL endpoints

This documentation may be needed to understand the authentication workflow followed by the application, since the Passport.JS package will make calls to some methods that may not be derived from the reading of the code itself.

#### Login a user
It begins with a call to a @Mutation in [auth.resolver](../auth/auth.resolver.ts) called **login**.
That endpoint has an AuthGuard of [local strategy](../auth/strategies/local.strategy.ts) type whose function is to act as a middleware, catching the login data and processing it as a login attempt.

##### Making local guard of PassportJS, GraphQL compatible 
The default implementation of PassportJS expects a RESP API. In order to make it compatible with GraphQL, we need to intercept the request, and reassign the place where the login data (username and password) are placed.

In order to do that, we overwrite the AuthGuard('local') implementation we are using as a function decorator, in the resolver:
```js
@UseGuards(LocalAuthGuard)
```

We do that in the local-auth.guard.ts placed under auth/guards folder:
```js
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

// don't forget to add this local strategy as a provider in auth.module.ts
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs().loginUserInput;
    return request;
  }
}
```

Esentially, it places the username & password fields (in fact, all the fields) contained within *loginUserInput* class into request.body, from where PassportJS will try to get the data to call the **validate** function from the implemented strategy (the **local strategy** in this case).

##### Implementing the validate function from LocalStrategy
As we are protecting the login endpoint with a **Local AuthGuard**, passport will call the local strategy as defined in the local.strategy.ts file, as declared in auth.module, in the *providers* property:
```js
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  // ...
providers: [AuthResolver, AuthService, LocalStrategy, JwtStrategy],
// ...
})
```

In the *local.strategy.ts* file we'll make our own implementation for when we gather authentication using  username and password fields, as defined in our implementation of local-auth.guard.ts:
```js
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
```

***PassportJS then will call the validate function, passing username and password parameters as string***

This **validate** function will contain the logic we'll be using to decide if a username/password combination is valid or not, instructing the application to go to a service (authService in our example) where the actual validation will be done.

As we can see in the validate function, 