/* eslint-disable no-console */
import axios from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, TypedDispatch } from '../../store';
import { loader } from '../loadingBar/action';

export const handleResponseError = (error: unknown): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    if (axios.isAxiosError(error)) {
      await dispatch(loader(false));
      await dispatch({ type: 'RESPONSE_ERROR', payload: error.message });
      // if (error.response?.status === 401 && window.location.pathname !== '/login') window.location.href = '/login';
    } else console.log(error);
  };
};
export const loginError = (loginErrorMassage: string): PayloadAction<string> => {
  return { type: 'LOGIN_ERROR', payload: loginErrorMassage };
};
