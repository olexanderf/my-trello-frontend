/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/default-param-last */
import { AnyAction } from '@reduxjs/toolkit';
import ICard from '../../../common/interfaces/ICard';

interface DragNDropItems {
  card: ICard | null;
  dragListID: number | null;
}
const initialState: DragNDropItems = {
  card: null,
  dragListID: null,
};

export default function reducer(state = initialState, action: AnyAction): DragNDropItems | null {
  switch (action.type) {
    case 'SET_DRAG_CARD':
      return { ...state, card: action.payload };
    case 'SET_DRAG_START_LIST_ID':
      return { ...state, dragListID: action.payload };
    default: {
      return state;
    }
  }
}
