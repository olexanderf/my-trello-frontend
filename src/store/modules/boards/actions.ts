/* eslint-disable no-console */
import axios from 'axios';
import { Dispatch } from 'redux';
import api from '../../../api/request';
import Board from '../../../common/interfaces/Board';
import store from '../../store';
import { handleResponseError } from '../errorHandler/action';

export const getBoards = () => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.get<string, { boards: Board[] }>('/board');
      // console.log(response);
      await dispatch({ type: 'UPDATE_BOARDS', payload: response.boards });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        store.dispatch(handleResponseError(e.message));
      } else console.log(e);
    }
  };
};
export const createBoard = (boardName: string) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.post('/board', {
        title: boardName,
      });
      // console.log(response);
      await dispatch({ type: 'CREATE_BOARD', payload: { response, boardName } });
      store.dispatch(getBoards());
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
};
export const deleteBoard = (id: number) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.delete(`/board/${id}`);
      await dispatch({ type: 'DELETE_BOARD', payload: response });
      // console.log(response);
      store.dispatch(getBoards());
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
};
