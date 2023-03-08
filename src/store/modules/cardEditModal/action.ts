import { PayloadAction, AnyAction } from '@reduxjs/toolkit';
import ICard, { MovedICard } from '../../../common/interfaces/ICard.d';
import { createCard, getBoard, moveCards } from '../board/actions';
import api from '../../../api/request';
import Lists from '../../../common/interfaces/Lists';
import SingleBoard from '../../../common/interfaces/OneBoard';
import { AppThunk, TypedDispatch } from '../../store';
import { handleResponseError } from '../errorHandler/action';
import { DeleteCardData, UpdatedCardsPosition } from '../../../common/interfaces/movedCardsInterface';

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

export const fetchBoardData = (id: number): AppThunk => {
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
      await dispatch(updateCardFields(title, description));
      await dispatch(getBoard(board_id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const deleteCardAction = (board_id: number, card_id: number, noFetchBoard?: boolean): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.delete(`/board/${board_id}/card/${card_id}`);
      await dispatch(setDefaultCard);
      if (!noFetchBoard) await dispatch(getBoard(board_id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
export const moveCardAnotherBoard = (
  card: MovedICard,
  deleteCardData: DeleteCardData,
  startMove?: UpdatedCardsPosition | undefined,
  targetMove?: UpdatedCardsPosition | undefined
): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await dispatch(
        createCard(card.board_id, card.title, card.list_id, card.position, card?.description, card?.custom, true)
      );
      await dispatch(deleteCardAction(deleteCardData.boardId, deleteCardData.cardId, true));
      if (startMove) await dispatch(moveCards(startMove.boardId, startMove.cards, startMove.lists, true));
      if (targetMove) await dispatch(moveCards(targetMove.boardId, targetMove.cards, targetMove.lists, true));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
