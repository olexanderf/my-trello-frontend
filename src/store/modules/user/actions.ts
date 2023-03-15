import { handleResponseError } from '../errorHandler/action';
import api from '../../../api/request';

export const getToken = (email: string, password: string) => {
  return async (): Promise<void> => {
    try {
      await api.post('/login', {
        email,
        password,
      });
    } catch (e) {
      handleResponseError(e);
    }
  };
};
// email: 'ttt222@example.com',
// password: 'dfdfdf',

export const createUser = (email: string, password: string) => {
  return async (): Promise<void> => {
    try {
      await api.post('/user', {
        email,
        password,
      });
    } catch (e) {
      handleResponseError(e);
    }
  };
};
