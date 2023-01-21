import { useDispatch, useSelector } from 'react-redux';
import { replaceCardInList } from '../../store/modules/board/actions';
import { AppDispatch, AppState } from '../../store/store';
import ICard from '../interfaces/ICard';
import Lists from '../interfaces/Lists';

// something wrong with this hook, not working yet
export function useCardMover(card: ICard, targetList: Lists): void {
  const dispatch: AppDispatch = useDispatch();
  const currentBoardLists = useSelector((state: AppState) => state.board.lists);
  const { card: dragCard, dragListID } = useSelector((state: AppState) => state.dragNDropItems);

  if (dragCard !== null) {
    const indexOfListDragedCard = currentBoardLists.findIndex((l) => l.id === dragListID);
    const currentIndex = currentBoardLists[indexOfListDragedCard].cards.indexOf(dragCard);

    // delete card from cards arr in list
    let cardsDragStart = [...currentBoardLists[indexOfListDragedCard].cards];
    cardsDragStart.splice(currentIndex, 1);
    cardsDragStart = cardsDragStart.map((c, index) => {
      return { ...c, position: index + 1 };
    });

    if (card !== undefined) {
      const dropIndex = card.position - 1;
      // change card position if list same
      if (dragListID === targetList.id) {
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
        // update state
        dispatch(replaceCardInList(changedArrOfList));
      }

      // move card to atnother list
      if (dragListID !== targetList.id) {
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
        const changedArrOfLists = [...currentBoardLists];
        changedArrOfLists.splice(indexOfListDragedCard, 1, newList);
        changedArrOfLists.splice(currentBoardLists.indexOf(targetList), 1, newTargetList);
        dispatch(replaceCardInList(changedArrOfLists));
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
        dispatch(replaceCardInList(changedArrOfList));
      }
      if (targetList.cards.length !== 0) {
        const newCard = { ...dragCard, position: targetList.cards.length + 1 };
        const changedArrOfCards = [...targetList.cards];
        changedArrOfCards.push(newCard);
        const newList = { ...currentBoardLists[indexOfListDragedCard], cards: cardsDragStart };
        const newTargetList = { ...targetList, cards: changedArrOfCards };
        const changedArrOfList = [...currentBoardLists];
        changedArrOfList.splice(indexOfListDragedCard, 1, newList);
        changedArrOfList.splice(currentBoardLists.indexOf(targetList), 1, newTargetList);
        dispatch(replaceCardInList(changedArrOfList));
      }
    }
  }
}
