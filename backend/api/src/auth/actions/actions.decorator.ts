import { SetMetadata } from '@nestjs/common';
import { Action } from './action.enum';

export const Actions = (...actions: Action[]) =>
  SetMetadata('actions', actions);
