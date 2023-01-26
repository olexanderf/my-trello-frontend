/* eslint-disable @typescript-eslint/default-param-last */
import { PayloadAction } from '@reduxjs/toolkit';
import SingleBoard from '../../../common/interfaces/OneBoard';

const initialState = {
  title: 'Demo board',
  lists: [],
} as SingleBoard;

export default function reducer(
  state = initialState,
  action: { type: string; payload: PayloadAction<SingleBoard> }
): SingleBoard {
  switch (action.type) {
    case 'FETCH_BOARD':
      return action.payload;
    case 'UPDATE_BOARD_NAME':
      return { ...state, title: action.payload };
    case 'CREATE_LIST':
      return { ...state };
    case 'UPDATE_LIST_NAME':
      return { ...state };
    case 'CREATE_CARD':
      return { ...state };
    case 'REPLACE_CARD_IN_LIST':
      return { ...state, lists: action.payload };
    default: {
      return state;
    }
  }
}
