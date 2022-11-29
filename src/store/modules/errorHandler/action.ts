/* eslint-disable no-console */
import axios from 'axios';
import { Dispatch } from 'redux';

export const handleResponseError = (error: unknown) => {
  return async (dispatch: Dispatch): Promise<void> => {
    if (axios.isAxiosError(error)) {
      await dispatch({ type: 'RESPONSE_ERROR', payload: error.message });
      await dispatch({ type: 'CLEAR_ERROR_STATE' });
    } else console.log(error);
  };
};
