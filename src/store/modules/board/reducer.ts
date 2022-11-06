import Board from '../../../common/interfaces/Board';

const initialState = {} as Board;

export default function reducer(state = initialState, action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'FETCH_BOARD':
      return action.payload;
    case 'UPDATE_BOARD_NAME':
      return { ...state };
    case 'CREATE_LIST':
      return { ...state };
    default: {
      return state;
    }
  }
}
