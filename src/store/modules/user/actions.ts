/* eslint-disable no-console */
import { Dispatch } from 'redux';
import api from '../../../api/request';

export const getToken = () => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.post('/login', {
        email: 'ttt222@example.com',
        password: 'dfdfdf',
      });
      console.log(response.data);
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
};

export const createUser = () => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.post('/user', {
        email: 'ttt222@example.com',
        password: 'dfdfdf',
      });
      console.log(response.data);
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
};
