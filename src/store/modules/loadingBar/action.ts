import { PayloadAction } from '@reduxjs/toolkit';

export const loader = (isLoading: boolean): PayloadAction<boolean> => {
  return { type: 'TOGGLE_LOADER', payload: isLoading };
};
