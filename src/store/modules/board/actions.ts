import { AnyAction, Dispatch } from 'redux';
import api from '../../../api/request';
import Lists from '../../../common/interfaces/Lists';
import SingleBoard from '../../../common/interfaces/OneBoard';
import UpdatedCards from '../../../common/interfaces/UpdatedCards';
import store from '../../store';
import { handleResponseError } from '../errorHandler/action';

export const getBoard = (id: number) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      const response = await api.get<string, { board: SingleBoard }>(`/board/${id}`);
      // console.log(response);
      await dispatch({ type: 'FETCH_BOARD', payload: response });
    } catch (e) {
      store.dispatch(handleResponseError(e));
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
      store.dispatch(handleResponseError(e));
    }
  };
};
export const createList = (id: number, listName: string, position: number) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      await api.post(`/board/${id}/list`, {
        title: listName,
        position,
      });
      await dispatch({ type: 'CREATE_LIST' });
      store.dispatch(getBoard(id));
    } catch (e) {
      store.dispatch(handleResponseError(e));
    }
  };
};
export const editListName = (board_id: number, listName: string, list_id: number, position: number) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      await api.put(`/board/${board_id}/list/${list_id}`, {
        title: listName,
        position,
      });
      await dispatch({ type: 'UPDATE_LIST_NAME' });
      store.dispatch(getBoard(board_id));
    } catch (e) {
      store.dispatch(handleResponseError(e));
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
) => {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      await api.post(`/board/${board_id}/card`, {
        title,
        list_id,
        position,
        description,
        custom,
      });
      await dispatch({ type: 'CREATE_CARD' });
      store.dispatch(getBoard(board_id));
    } catch (e) {
      store.dispatch(handleResponseError(e));
    }
  };
};
export const replaceCardInList = (lists: Lists[]): AnyAction => {
  return { type: 'REPLACE_CARD_IN_LIST', payload: lists };
};

export const moveCards = (boadrd_id: number, arrUpdatedCards: UpdatedCards[], lists: Lists[]) => {
  return async (dispatch: Dispatch): Promise<void> => {
    dispatch(replaceCardInList(lists));
    try {
      await api.put(`/board/${boadrd_id}/card`, arrUpdatedCards);
      store.dispatch(getBoard(boadrd_id));
    } catch (e) {
      store.dispatch(handleResponseError(e));
    }
  };
};
