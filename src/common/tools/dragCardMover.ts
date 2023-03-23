import ICard from '../interfaces/ICard';
import Lists from '../interfaces/Lists';
import UpdatedCards from '../interfaces/UpdatedCards';

function insertObjectInArr<T>(arr: Array<T>, insertIndex: number, object: T): Array<T> {
  return [...arr.slice(0, insertIndex), object, ...arr.slice(insertIndex)];
}
function replaceCardsInList(listArr: Lists[], list: Lists, cards: ICard[], insertIndex: number): Lists[] {
  return [...listArr.slice(0, insertIndex), { ...list, cards }, ...listArr.slice(insertIndex + 1)];
}
export default function dragCardMover(
  targetList: Lists,
  currentBoardLists: Lists[],
  dragListId: number,
  dragCard: ICard,
  card?: ICard
): { arrUpdatedCards: UpdatedCards[]; changedArrOfList: Lists[] } {
  const indexOfListDraggedCard = currentBoardLists.findIndex((l) => l.id === dragListId);

  // delete card from cards arr in list
  let cardsDragStart = currentBoardLists[indexOfListDraggedCard].cards
    .filter((c) => c.id !== dragCard.id)
    .map((c: ICard, index) => {
      return { ...c, position: index + 1 };
    });
  // change card position if list same
  if (card !== undefined) {
    const dropIndex = dragCard.position < card.position ? card.position - 2 : card.position - 1;
    if (dragListId === targetList.id) {
      // add card to list and change position
      cardsDragStart = insertObjectInArr(cardsDragStart, dropIndex, dragCard).map((c, index) => {
        return { ...c, position: index + 1 };
      });
      // // update cards arr in list
      const changedArrOfList = replaceCardsInList(
        currentBoardLists,
        targetList,
        cardsDragStart,
        indexOfListDraggedCard
      );
      // update state and send request to server
      const arrUpdatedCards: UpdatedCards[] = cardsDragStart.map((c) => {
        return { id: c.id, position: c.position, list_id: targetList.id };
      });
      return { arrUpdatedCards, changedArrOfList };
    }

    // move card to another list
    if (dragListId !== targetList.id) {
      // add card to target card arr and change positions of card
      const changedArrOfCards = insertObjectInArr(targetList.cards, dropIndex, dragCard).map((c, index) => {
        return { ...c, position: index + 1 };
      });
      // update start drag list
      let changedArrOfList = replaceCardsInList(
        currentBoardLists,
        currentBoardLists[indexOfListDraggedCard],
        cardsDragStart,
        indexOfListDraggedCard
      );
      changedArrOfList = replaceCardsInList(
        currentBoardLists,
        targetList,
        changedArrOfCards,
        currentBoardLists.indexOf(targetList)
      );
      // update state and send request
      const arrUpdatedCards = [
        ...cardsDragStart.map((c) => {
          return { id: c.id, position: c.position, list_id: currentBoardLists[indexOfListDraggedCard].id };
        }),
        ...changedArrOfCards.map((c) => {
          return { id: c.id, position: c.position, list_id: targetList.id };
        }),
      ];
      return { arrUpdatedCards, changedArrOfList };
    }
  } else {
    if (targetList.cards.length === 0) {
      let changedArrOfList = replaceCardsInList(
        currentBoardLists,
        currentBoardLists[indexOfListDraggedCard],
        cardsDragStart,
        indexOfListDraggedCard
      );
      changedArrOfList = replaceCardsInList(
        changedArrOfList,
        targetList,
        [{ ...dragCard, position: 1 }],
        currentBoardLists.indexOf(targetList)
      );
      // update state and send request to server
      const arrUpdatedCards: UpdatedCards[] = cardsDragStart.map((c) => {
        return { id: c.id, position: c.position, list_id: currentBoardLists[indexOfListDraggedCard].id };
      });
      arrUpdatedCards.push({ id: dragCard.id, position: 1, list_id: targetList.id });
      return { arrUpdatedCards, changedArrOfList };
    }
    if (targetList.cards.length !== 0) {
      // Condition for avoiding duplication of cards
      let changedArrOfCards =
        targetList.id !== dragListId ? [...targetList.cards, dragCard] : [...cardsDragStart, dragCard];

      changedArrOfCards = changedArrOfCards.map((c: ICard, index) => {
        return { ...c, position: index + 1 };
      });
      let changedArrOfList = replaceCardsInList(
        currentBoardLists,
        currentBoardLists[indexOfListDraggedCard],
        cardsDragStart,
        indexOfListDraggedCard
      );
      changedArrOfList = replaceCardsInList(
        changedArrOfList,
        targetList,
        changedArrOfCards,
        currentBoardLists.indexOf(targetList)
      );
      // update state and send request
      const arrUpdatedCards = [
        ...cardsDragStart.map((c) => {
          return { id: c.id, position: c.position, list_id: currentBoardLists[indexOfListDraggedCard].id };
        }),
        ...changedArrOfCards.map((c) => {
          return { id: c.id, position: c.position, list_id: targetList.id };
        }),
      ];
      return { arrUpdatedCards, changedArrOfList };
    }
  }
  return { arrUpdatedCards: [], changedArrOfList: [] };
}
