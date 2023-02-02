import ICard from './ICard';
import Lists from './Lists';

export default interface CardEditModal {
  isVisibleCardModalEdit: boolean;
  currentList: Lists;
  cardOnModal: ICard;
}
