import { AnyAction } from '@reduxjs/toolkit';

/* eslint-disable @typescript-eslint/default-param-last */
export default function reducer(state = '', action: AnyAction): string {
  switch (action.type) {
    case 'RESPONSE_ERROR':
      return action.payload;
    case 'CLEAR_ERROR_STATE':
      return '';
    default:
      return state;
  }
}
