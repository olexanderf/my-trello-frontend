import { AnyAction } from 'redux';
import ICard from '../../../common/interfaces/ICard';

export const setDragCard = (card: ICard | null): AnyAction => {
  return { type: 'SET_DRAG_CARD', payload: card };
};
export const setDragStartListId = (dragListID: number | null): AnyAction => {
  return { type: 'SET_DRAG_START_LIST_ID', payload: dragListID };
};
