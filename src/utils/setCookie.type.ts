import {
  BaseParameterObject,
  ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type SetCookieHeaderType = {
  [x: string]: BaseParameterObject | ReferenceObject;
};
const SetCookieHeader: SetCookieHeaderType = {};
SetCookieHeader['Set-Cookie'] = {
  schema: {
    type: 'string',
    example: 'Authentication=abcde12345; Path=/; HttpOnly',
  },
};

export default SetCookieHeader;
