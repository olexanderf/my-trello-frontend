import { Dispatch } from 'redux';
import api from '../../../api/request';
import Board from '../../../common/interfaces/Board';
import store from '../../store';

export const getBoard = (id: number) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.get<string, { board: Board[] }>(`/board/${id}`);
      // console.log(response);
      await dispatch({ type: 'FETCH_BOARD', payload: response });
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
};
export const editNameBoard = (id: number, boardName: string) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      await api.put(`/board/${id}`, {
        title: boardName,
      });
      await dispatch({ type: 'UPDATE_BOARD_NAME' });
      // console.log(response);
      store.dispatch(getBoard(id));
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
};
export const createList = (id: number, listName: string, position: number) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.post(`/board/${id}/list`, {
        title: listName,
        position: position,
      });
      await dispatch({ type: 'CREATE_LIST'});
      store.dispatch(getBoard(id));
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };
};
export const editListName = (board_id: number, listName: string, list_id: number, position: number) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.put(`/board/${board_id}/list/${list_id}`, {
        title: listName,
        position: position,
      })
    } catch (e) {
      // console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  }
}
