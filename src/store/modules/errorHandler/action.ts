import { AnyAction } from 'redux';

export const handleResponseError = (error_message: string): AnyAction => {
  return { type: 'RESPONSE_ERROR', payload: error_message };
};
