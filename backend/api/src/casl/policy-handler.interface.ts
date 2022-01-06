import { Ability } from '@casl/ability';

interface IPolicyHandler {
  handle(ability: Ability): boolean;
}

type PolicyHandlerCallback = (ability: Ability) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
