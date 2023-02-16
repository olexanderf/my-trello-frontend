import { PayloadAction, AnyAction } from '@reduxjs/toolkit';
import api from '../../../api/request';
import ICard from '../../../common/interfaces/ICard';
import Lists from '../../../common/interfaces/Lists';
import SingleBoard from '../../../common/interfaces/OneBoard';
import { AppThunk, TypedDispatch } from '../../store';
import { getBoard } from '../board/actions';
import { handleResponseError } from '../errorHandler/action';

export const toggleCardEditModal = (isVisibleCardModalEdit: boolean): PayloadAction<boolean> => {
  return { type: 'TOGGLE_CARD_EDIT_MODAL', payload: isVisibleCardModalEdit };
};
export const setListOnModal = (list: Lists): PayloadAction<Lists> => {
  return { type: 'SET_LIST_CARD_MODAL', payload: list };
};
export const setBoardOnModal = (board: SingleBoard): PayloadAction<SingleBoard> => {
  return { type: 'SET_BOARD_MODAL', payload: board };
};
export const setCardModal = (card: ICard): PayloadAction<ICard> => {
  return { type: 'SET_CARD_MODAL', payload: card };
};
export const updateCardFields = (title: string, description?: string): AnyAction => {
  return { type: 'UPDATE_CARD_FIELDS', payload: { title, description } };
};
export const setDefaultCard = (): AnyAction => {
  return { type: 'DEFAULT_CARD' };
};

export const fetchBoardDate = (id: number): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      const response = await api.get<string, SingleBoard>(`/board/${id}`);
      await dispatch(setBoardOnModal(response));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const updateCard = (
  board_id: number,
  card_id: number,
  list_id: number,
  title: string,
  description?: string
): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.put(`/board/${board_id}/card/${card_id}`, {
        title,
        description,
        list_id,
      });
      dispatch(updateCardFields(title, description));
      dispatch(getBoard(board_id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const deleteCardAction = (board_id: number, card_id: number): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.delete(`/board/${board_id}/card/${card_id}`);
      dispatch(setDefaultCard);
      dispatch(getBoard(board_id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
