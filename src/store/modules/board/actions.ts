import { PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, TypedDispatch } from '../../store';
import api from '../../../api/request';
import Lists from '../../../common/interfaces/Lists';
import SingleBoard from '../../../common/interfaces/OneBoard';
import UpdatedCards from '../../../common/interfaces/UpdatedCards';
import { handleResponseError } from '../errorHandler/action';

export const getBoard = (id: number): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      const response = await api.get<string, { board: SingleBoard }>(`/board/${id}`);
      // console.log(response);
      await dispatch({ type: 'FETCH_BOARD', payload: response });
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const editNameBoard = (id: number, boardName: string): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.put(`/board/${id}`, {
        title: boardName,
      });
      await dispatch({ type: 'UPDATE_BOARD_NAME', payload: boardName });
      // console.log(response);
      dispatch(getBoard(id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const createList = (id: number, listName: string, position: number): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.post(`/board/${id}/list`, {
        title: listName,
        position,
      });
      await dispatch({ type: 'CREATE_LIST' });
      dispatch(getBoard(id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const editListName = (board_id: number, listName: string, list_id: number, position: number): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.put(`/board/${board_id}/list/${list_id}`, {
        title: listName,
        position,
      });
      await dispatch({ type: 'UPDATE_LIST_NAME' });
      dispatch(getBoard(board_id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const createCard = (
  board_id: number,
  title: string,
  list_id: number,
  position: number,
  description?: string,
  custom?: object
): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.post(`/board/${board_id}/card`, {
        title,
        list_id,
        position,
        description,
        custom,
      });
      await dispatch({ type: 'CREATE_CARD' });
      dispatch(getBoard(board_id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const replaceCardInList = (lists: Lists[]): PayloadAction<Lists[]> => {
  return { type: 'REPLACE_CARD_IN_LIST', payload: lists };
};

export const moveCards = (board_id: number, arrUpdatedCards: UpdatedCards[], lists: Lists[]): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    dispatch(replaceCardInList(lists));
    try {
      await api.put(`/board/${board_id}/card`, arrUpdatedCards);
      dispatch(getBoard(board_id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
