/* eslint-disable @typescript-eslint/default-param-last */

import CardEditModal from '../../../common/interfaces/CardEditModal';

const initialState = {
  isVisibleCardModalEdit: false,
};
export default function reducer(state = initialState, action: { type: string; payload: boolean }): CardEditModal {
  switch (action.type) {
    case 'TOGGLE_CARD_EDIT_MODAL':
      return { ...state, isVisibleCardModalEdit: action.payload };
    default:
      return state;
  }
}
