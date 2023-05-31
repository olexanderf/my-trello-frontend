/* eslint-disable no-console */
import axios from 'axios';
import { AppThunk, TypedDispatch } from '../../store';

export const handleResponseError = (error: unknown): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    if (axios.isAxiosError(error)) {
      await dispatch({ type: 'RESPONSE_ERROR', payload: error.message });
      await dispatch({ type: 'CLEAR_ERROR_STATE' });
      // if (error.response?.status === 401) window.location.href = '/login';
    } else console.log(error);
  };
};
