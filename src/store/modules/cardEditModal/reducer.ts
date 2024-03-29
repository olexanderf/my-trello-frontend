/* eslint-disable @typescript-eslint/default-param-last */

import { AnyAction } from '@reduxjs/toolkit';
import ICardEditModal from '../../../common/interfaces/CardEditModal';

const initialState: ICardEditModal = {
  isVisibleCardModalEdit: false,
  boardOnModal: { title: 'Demo title', lists: [] },
  listOnModal: { id: 0, title: 'demo', position: 0, cards: [] },
  cardOnModal: {
    id: 0,
    title: 'demo',
    list_id: 0,
    position: 0,
    description: 'demo description',
  },
};
export default function reducer(state = initialState, action: AnyAction): ICardEditModal {
  switch (action.type) {
    case 'TOGGLE_CARD_EDIT_MODAL':
      return { ...state, isVisibleCardModalEdit: action.payload };
    case 'SET_CARD_MODAL':
      return { ...state, cardOnModal: action.payload };
    case 'SET_BOARD_MODAL':
      return { ...state, boardOnModal: action.payload };
    case 'SET_LIST_CARD_MODAL':
      return { ...state, listOnModal: action.payload };
    case 'UPDATE_CARD_FIELDS':
      return {
        ...state,
        cardOnModal: { ...state.cardOnModal, title: action.payload.title, description: action.payload.description },
      };
    case 'DEFAULT_CARD':
      return {
        ...state,
        cardOnModal: initialState.cardOnModal,
      };
    default:
      return state;
  }
}
