import Board from '../../../common/interfaces/Board';

const initialState = [] as Board[];

// eslint-disable-next-line @typescript-eslint/default-param-last
export default function reducer(state = initialState, action: { type: string; payload: Board[] }): object {
  switch (action.type) {
    case 'UPDATE_BOARDS':
      return action.payload;
    case 'CREATE_BOARD':
      return {
        ...state,
      };
    default: {
      return state;
    }
  }
}
