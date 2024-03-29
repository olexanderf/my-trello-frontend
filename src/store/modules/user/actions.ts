import { handleResponseError } from '../errorHandler/action';
import api from '../../../api/request';
import { TypedDispatch } from '../../store';
import LoginResponseData from '../../../common/interfaces/LoginResponseData';

export const login = (email: string, password: string) => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      const response: LoginResponseData = await api.post('/login', {
        email,
        password,
      });
      if (response) {
        localStorage.setItem('token', `${response.token}`);
        localStorage.setItem('refreshToken', `${response.refreshToken}`);
        window.location.href = '/';
      }
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
// email: 'ttt222@example.com',
// password: 'dfdfdf',

export const createUser = (email: string, password: string) => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.post('/user', {
        email,
        password,
      });
      window.location.href = '/login';
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
