import api from '../../../api/request';
import Board from '../../../common/interfaces/Board';
import { AppThunk, TypedDispatch } from '../../store';
import { handleResponseError } from '../errorHandler/action';

export const getBoards = (): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      const response = await api.get<string, { boards: Board[] }>('/board');
      // console.log(response);
      await dispatch({ type: 'UPDATE_BOARDS', payload: response.boards });
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const createBoard = (boardName: string): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      const response = await api.post('/board', {
        title: boardName,
      });
      // console.log(response);
      await dispatch({ type: 'CREATE_BOARD', payload: { response, boardName } });
      await dispatch(getBoards());
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const deleteBoard = (id: number): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.delete(`/board/${id}`);
      await dispatch({ type: 'DELETE_BOARD' });
      // console.log(response);
      await dispatch(getBoards());
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const setColorIconBoard = (id: number, color: string): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.put(`/board/${id}`, { custom: { color } });
      await dispatch({ type: 'SET_ICON_COLOR' });
      await dispatch(getBoards());
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
