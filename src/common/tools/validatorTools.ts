import { emailRgx } from '../constants/regExp';

export const checkValidEmail = (emailAddress: string): boolean => {
  return !!emailAddress.match(emailRgx);
};
