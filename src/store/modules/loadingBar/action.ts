import { AnyAction } from 'redux';
/* eslint-disable @typescript-eslint/indent */

export const loader = (isLoading: boolean): AnyAction => {
  return { type: 'TOGGLE_LOADER', payload: isLoading };
};
