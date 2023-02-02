import { AnyAction } from 'redux';
import api from '../../../api/request';
import ICard from '../../../common/interfaces/ICard';
import Lists from '../../../common/interfaces/Lists';
import { AppThunk, TypedDispatch } from '../../store';
import { getBoard } from '../board/actions';
import { handleResponseError } from '../errorHandler/action';

export const toggleCardEditModal = (isVisibleCardModalEdit: boolean): AnyAction => {
  return { type: 'TOGGLE_CARD_EDIT_MODAL', payload: isVisibleCardModalEdit };
};
export const setCurrentList = (list: Lists): AnyAction => {
  return { type: 'SET_LIST_CARD_MODAL', payload: list };
};
export const setCardModal = (card: ICard): AnyAction => {
  return { type: 'SET_CARD_MODAL', payload: card };
};
export const updateCardTitle = (title: string): AnyAction => {
  return { type: 'UPDATE_CARD_TITLE', payload: title };
};

export const updateCardName = (board_id: number, card_id: number, list_id: number, title: string): AppThunk => {
  return async (dispatch: TypedDispatch): Promise<void> => {
    try {
      await api.put(`/board/${board_id}/card/${card_id}`, {
        title,
        list_id,
      });
      dispatch(updateCardTitle(title));
      dispatch(getBoard(board_id));
    } catch (e) {
      dispatch(handleResponseError(e));
    }
  };
};
