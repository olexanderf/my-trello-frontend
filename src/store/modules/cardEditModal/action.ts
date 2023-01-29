import { AnyAction } from 'redux';

export const toggleCardEditModal = (isVisibleCardModalEdit: boolean): AnyAction => {
  return { type: 'TOGGLE_CARD_EDIT_MODAL', payload: isVisibleCardModalEdit };
};
