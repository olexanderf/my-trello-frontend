import { handleResponseError } from '../errorHandler/action';
import api from '../../../api/request';

interface LoginResponseData {
  resut: string;
  token: string;
  refreshToken: string;
}

export const login = (email: string, password: string) => {
  return async (): Promise<void> => {
    try {
      const response: LoginResponseData = await api.post('/login', {
        email,
        password,
      });
      localStorage.setItem('token', `${response.token}`);
      localStorage.setItem('refreshToken', `${response.refreshToken}`);
      window.location.href = '/';
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
