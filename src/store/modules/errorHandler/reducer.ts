import { AnyAction } from '@reduxjs/toolkit';

/* eslint-disable @typescript-eslint/default-param-last */
interface ErrorsMassages {
  commonErrorMassage: string;
  loginErrorMassage: string;
}
export default function reducer(
  state = { commonErrorMassage: '', loginErrorMassage: '' },
  action: AnyAction
): ErrorsMassages {
  switch (action.type) {
    case 'RESPONSE_ERROR':
      return { ...state, commonErrorMassage: action.payload };
    case 'LOGIN_ERROR':
      return { ...state, loginErrorMassage: action.payload };
    default:
      return state;
  }
}
