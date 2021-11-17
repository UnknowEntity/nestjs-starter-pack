import { CookieOptions } from 'express';

export default interface CookieInterface {
  name: string;
  value: string;
  cookieOptions: CookieOptions;
}
