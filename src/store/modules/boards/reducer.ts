import Board from '../../../common/interfaces/Board';

const initialState = {
  boards: [] as Board[],
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export default function reducer(state = initialState, action: { type: string; payload?: Board[] }): object {
  switch (action.type) {
    case 'UPDATE_BOARDS':
      return {
        ...state,
        boards: [...state.boards, ...action.payload],
      };
    case 'CREATE_BOARD':
      return {
        ...state,
        boards: [...state.boards, action.payload],
      };
    default: {
      return { ...state, ...action.payload };
    }
  }
}
