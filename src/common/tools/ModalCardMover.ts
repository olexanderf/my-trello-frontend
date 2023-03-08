import ICard from '../interfaces/ICard';
import Lists from '../interfaces/Lists';
import SingleBoard from '../interfaces/OneBoard';
import UpdatedCards from '../interfaces/UpdatedCards';

const updateCardPositions = (
  cardsArr: ICard[],
  targetBoard: SingleBoard,
  indexOfList: number,
  newPosition?: number,
  newCard?: ICard
): { arrUpdatedCards: UpdatedCards[]; updatedListsArr: Lists[] } => {
  let arrOfCards = cardsArr;
  if (newCard && newPosition) arrOfCards.splice(newPosition - 1, 0, newCard);
  arrOfCards = cardsArr.map((c, index) => {
    // case if card move to another board and need to replace position in cards arr
    if (newPosition && !newCard && c.position >= newPosition) return { ...c, position: c.position + 1 };

    return { ...c, position: index + 1 };
  });
  const newList = { ...targetBoard.lists[indexOfList], cards: arrOfCards };
  const updatedListsArr = [...targetBoard.lists];
  updatedListsArr.splice(indexOfList, 1, newList);
  const arrUpdatedCards: UpdatedCards[] = arrOfCards.map((c) => {
    return { id: c.id, position: c.position, list_id: targetBoard.lists[indexOfList].id };
  });
  return { arrUpdatedCards, updatedListsArr };
};

export default updateCardPositions;
