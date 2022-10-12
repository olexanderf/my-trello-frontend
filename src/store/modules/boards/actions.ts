import { Dispatch } from 'redux';
import api from '../../../api/request';

export const getBoards = async (dispatch: Dispatch): Promise<void> => {
  try {
    const response = await api.get('/board');
    const { boards } = response.data.boards;
    await dispatch({ type: 'UPDATE_BOARDS', payload: boards });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};

// export const createBoard = async (dispatch: Dispatch): Promise<void> => {
//   try {
//     await api.post('/board');
//     await dispatch(getBoards());
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.log(e);
//     dispatch({ type: 'ERROR_ACTION_TYPE' });
//   }
// };
