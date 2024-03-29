/* eslint-disable @typescript-eslint/default-param-last */
import { AnyAction } from '@reduxjs/toolkit';
import SingleBoard from '../../../common/interfaces/OneBoard';

const initialState: SingleBoard = {
  title: 'Demo board',
  lists: [],
};

export default function reducer(state = initialState, action: AnyAction): SingleBoard {
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
    case 'DELETE_LIST':
      return { ...state, lists: state.lists.filter((l) => l.id !== action.payload) };
    case 'REPLACE_CARD_IN_LIST':
      return { ...state, lists: action.payload };
    default: {
      return state;
    }
  }
}
