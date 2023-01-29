import { AnyAction } from 'redux';

export const loader = (isLoading: boolean): AnyAction => {
  return { type: 'TOGGLE_LOADER', payload: isLoading };
};
