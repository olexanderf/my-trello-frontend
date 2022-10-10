import { Dispatch } from 'redux';
import api from '../../../api/request';

export const getBoards = async (dispatch: Dispatch): Promise<void> => {
  try {
    const { boards } = await api.get('/boards');
    await dispatch({ type: 'UPDATE_BOARDS', payload: boards });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};
