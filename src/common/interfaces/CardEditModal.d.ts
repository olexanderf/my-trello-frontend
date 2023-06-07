import ICard from './ICard';
import Lists from './Lists';
import SingleBoard from './OneBoard';

export default interface CardEditModal {
  isVisibleCardModalEdit: boolean;
  boardOnModal: SingleBoard;
  listOnModal: Lists;
  cardOnModal: ICard;
}
