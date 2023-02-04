/* eslint-disable @typescript-eslint/default-param-last */
import { AnyAction } from '@reduxjs/toolkit';
import Board from '../../../common/interfaces/Board';

const initialState: Board[] = [{ id: 0, title: 'Demo board' }];

export default function reducer(state = initialState, action: AnyAction): Board[] {
  switch (action.type) {
    case 'UPDATE_BOARDS':
      return action.payload;
    case 'CREATE_BOARD':
      return [...state];
    case 'DELETE_BOARD':
      return [...state];
    default: {
      return state;
    }
  }
}
