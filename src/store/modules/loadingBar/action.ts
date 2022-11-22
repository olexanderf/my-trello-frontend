/* eslint-disable @typescript-eslint/indent */

export const loader = (isLoading: boolean): object => {
  return { type: 'TOGGLE_LOADER', payload: isLoading };
};
