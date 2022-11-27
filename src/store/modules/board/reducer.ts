/* eslint-disable @typescript-eslint/default-param-last */
import Board from '../../../common/interfaces/Board';

const initialState = {} as Board;

export default function reducer(state = initialState, action: { type: string; payload?: Board }): Board {
  switch (action.type) {
    case 'FETCH_BOARD':
      return action.payload;
    case 'UPDATE_BOARD_NAME':
      return { ...state };
    case 'CREATE_LIST':
      return { ...state };
    case 'UPDATE_LIST_NAME':
      return { ...state };
    case 'CREATE_CARD':
      return { ...state };
    default: {
      return state;
    }
  }
}
