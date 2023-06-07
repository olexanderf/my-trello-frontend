import { PayloadAction } from '@reduxjs/toolkit';
import ICard from '../../../common/interfaces/ICard';

export const setDragCard = (card: ICard | null): PayloadAction<ICard | null> => {
  return { type: 'SET_DRAG_CARD', payload: card };
};
export const setDragStartListId = (dragListID: number | null): PayloadAction<number | null> => {
  return { type: 'SET_DRAG_START_LIST_ID', payload: dragListID };
};
