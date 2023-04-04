import ICard from '../interfaces/ICard';
import Lists from '../interfaces/Lists';
import SingleBoard from '../interfaces/OneBoard';
import UpdatedCards from '../interfaces/UpdatedCards';
import { insertObjectInArr } from './dragCardMover';

const updateCardPositions = (
  cardsArr: ICard[],
  targetBoard: SingleBoard,
  indexOfList: number,
  newPosition?: number,
  newCard?: ICard
): { arrUpdatedCards: UpdatedCards[]; updatedListsArr: Lists[] } => {
  // let arrOfCards = [...cardsArr];
  // if (newCard && newPosition) arrOfCards.splice(newPosition - 1, 0, newCard);
  // arrOfCards.splice(newPosition - 1, 0, newCard);
  let arrOfCards = newPosition ? insertObjectInArr(cardsArr, newPosition - 1, newCard) : [...cardsArr];
  arrOfCards = arrOfCards.map((c, index) => {
    // case if card move to another board and need to replace position in cards arr
    if (newPosition && newCard && newCard.id !== c.id && c.position >= newPosition)
      return { ...c, position: c.position + 1 };
    if (newPosition && !newCard && c.position >= newPosition) return { ...c, position: c.position + 1 };

    return { ...c, position: index + 1 };
  });
  const newList = { ...targetBoard.lists[indexOfList], cards: arrOfCards };
  const updatedListsArr = [...targetBoard.lists];
  updatedListsArr.splice(indexOfList, 1, newList);
  // const updatedListsArr = replaceCardsInList(
  //   targetBoard.lists,
  //   targetBoard.lists[indexOfList],
  //   arrOfCards,
  //   indexOfList
  // );
  const arrUpdatedCards: UpdatedCards[] = arrOfCards.map((c) => {
    return { id: c.id, position: c.position, list_id: targetBoard.lists[indexOfList].id };
  });
  return { arrUpdatedCards, updatedListsArr };
};

export default updateCardPositions;
