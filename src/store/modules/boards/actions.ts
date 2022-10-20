/* eslint-disable no-console */
import { Dispatch } from 'redux';
import api from '../../../api/request';
import Board from '../../../common/interfaces/Board';

export const getBoards = () => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.get<string, { boards: Board[] }>('/board');
      console.log(response);
      const { boards } = response;
      await dispatch({ type: 'UPDATE_BOARDS', payload: boards });
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
};
export const createBoard = (boardName: string) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      await api.post('/board', {
        title: boardName,
      });
      await dispatch({ type: 'CREATE_BOARD', payload: boardName });
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
};
