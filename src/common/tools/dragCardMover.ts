import ICard from '../interfaces/ICard';
import Lists from '../interfaces/Lists';
import UpdatedCards from '../interfaces/UpdatedCards';

export default function dragCardMover(
  targetList: Lists,
  currentBoardLists: Lists[],
  dragListId: number,
  dragCard: ICard,
  card?: ICard
): { arrUpdatedCards: UpdatedCards[]; changedArrOfList: Lists[] } {
  const indexOfListDragedCard = currentBoardLists.findIndex((l) => l.id === dragListId);
  const currentIndex = currentBoardLists[indexOfListDragedCard].cards.indexOf(dragCard);

  // delete card from cards arr in list
  let cardsDragStart = [...currentBoardLists[indexOfListDragedCard].cards];
  cardsDragStart.splice(currentIndex, 1);
  cardsDragStart = cardsDragStart.map((c, index) => {
    return { ...c, position: index + 1 };
  });

  // change card position if list same
  if (card !== undefined) {
    const dropIndex = card.position - 1;
    if (dragListId === targetList.id) {
      // add card to list and change position
      cardsDragStart.splice(dropIndex, 0, dragCard);
      cardsDragStart = cardsDragStart.map((c, index) => {
        return { ...c, position: index + 1 };
      });
      // update cards arr in list
      const newList = { ...targetList, cards: cardsDragStart };
      // update list and replace to new
      const changedArrOfList = [...currentBoardLists];
      changedArrOfList.splice(indexOfListDragedCard, 1, newList);
      // update state and send request to server
      const arrUpdatedCards: UpdatedCards[] = cardsDragStart.map((c) => {
        return { id: c.id, position: c.position, list_id: targetList.id };
      });
      return { arrUpdatedCards, changedArrOfList };
    }

    // move card to atnother list
    if (dragListId !== targetList.id) {
      // add card to target card arr and change positions of card
      let changedArrOfCards = [...targetList.cards];
      changedArrOfCards.splice(dropIndex, 0, dragCard);
      changedArrOfCards = changedArrOfCards.map((c, index) => {
        return { ...c, position: index + 1 };
      });
      // update start drag list
      const newList = { ...currentBoardLists[indexOfListDragedCard], cards: cardsDragStart };
      // update card arr in target list
      const newTargetList = { ...targetList, cards: changedArrOfCards };
      // update list and replace to new
      const changedArrOfList = [...currentBoardLists];
      changedArrOfList.splice(indexOfListDragedCard, 1, newList);
      changedArrOfList.splice(currentBoardLists.indexOf(targetList), 1, newTargetList);

      // update state and send request
      const arrUpdatedCards: UpdatedCards[] = cardsDragStart.map((c) => {
        return { id: c.id, position: c.position, list_id: currentBoardLists[indexOfListDragedCard].id };
      });
      const targetArrUpdatedCards: UpdatedCards[] = changedArrOfCards.map((c) => {
        return { id: c.id, position: c.position, list_id: targetList.id };
      });
      arrUpdatedCards.splice(arrUpdatedCards.length, 0, ...targetArrUpdatedCards);
      return { arrUpdatedCards, changedArrOfList };
    }
  } else {
    if (targetList.cards.length === 0) {
      const newCard = { ...dragCard, position: 1 };
      const tempArr = [newCard];
      const newList = { ...currentBoardLists[indexOfListDragedCard], cards: cardsDragStart };
      const newTargetList = { ...targetList, cards: tempArr };
      const changedArrOfList = [...currentBoardLists];
      changedArrOfList.splice(indexOfListDragedCard, 1, newList);
      changedArrOfList.splice(currentBoardLists.indexOf(targetList), 1, newTargetList);

      // update state and send request to serever
      const arrUpdatedCards: UpdatedCards[] = cardsDragStart.map((c) => {
        return { id: c.id, position: c.position, list_id: currentBoardLists[indexOfListDragedCard].id };
      });
      arrUpdatedCards.push({ id: newCard.id, position: newCard.position, list_id: targetList.id });
      return { arrUpdatedCards, changedArrOfList };
    }
    if (targetList.cards.length !== 0) {
      const newCard = { ...dragCard, position: targetList.cards.length + 1 };

      // Condition for avoiding dublication of cards
      let changedArrOfCards: ICard[] = [];
      if (targetList.id !== dragListId) {
        changedArrOfCards = [...targetList.cards];
      } else {
        changedArrOfCards = [...cardsDragStart];
      }

      changedArrOfCards.push(newCard);
      const newList = { ...currentBoardLists[indexOfListDragedCard], cards: cardsDragStart };
      const newTargetList = { ...targetList, cards: changedArrOfCards };
      const changedArrOfList = [...currentBoardLists];
      changedArrOfList.splice(indexOfListDragedCard, 1, newList);
      changedArrOfList.splice(currentBoardLists.indexOf(targetList), 1, newTargetList);
      // update state and send request
      const arrUpdatedCards: UpdatedCards[] = cardsDragStart.map((c) => {
        return { id: c.id, position: c.position, list_id: currentBoardLists[indexOfListDragedCard].id };
      });
      const targetArrUpdatedCards: UpdatedCards[] = changedArrOfCards.map((c) => {
        return { id: c.id, position: c.position, list_id: targetList.id };
      });

      arrUpdatedCards.splice(arrUpdatedCards.length, 0, ...targetArrUpdatedCards);
      return { arrUpdatedCards, changedArrOfList };
    }
  }
  return { arrUpdatedCards: [], changedArrOfList: [] };
}
