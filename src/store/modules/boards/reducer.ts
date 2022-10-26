import Board from '../../../common/interfaces/Board';

const initialState = [{ id: 0, title: 'Initial board' }] as Board[];

export default function reducer(state = initialState, action: { type: string; payload: Board[] }): object {
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
