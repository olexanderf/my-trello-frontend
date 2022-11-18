/* eslint-disable @typescript-eslint/indent */
export const loader = (isLoading: boolean): object => {
  return isLoading
    ? {
        type: 'SHOW_LOADER',
        payload: isLoading,
      }
    : {
        type: 'HIDE_LOADER',
        payload: isLoading,
      };
};
