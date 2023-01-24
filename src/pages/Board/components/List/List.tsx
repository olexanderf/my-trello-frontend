import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { boardInputRegex } from '../../../../common/constants/regExp';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import { createCard, editListName, moveCards, replaceCardInList } from '../../../../store/modules/board/actions';
import { setDragCard, setDragStartListId } from '../../../../store/modules/dragNdrop/action';
import { AppDispatch, AppState } from '../../../../store/store';
import Modal from '../../../Multipurpose/Modal/Modal';
import Card from '../Card/Card';
import './list.scss';

interface PropsType {
  list: Lists;
}

export default function List(props: PropsType): JSX.Element {
  const { list } = props;
  const { title, cards, id, position } = list;
  const { board_id: boardId } = useParams();
  const dispatch: AppDispatch = useDispatch();

  // work with list name change
  const [isValidInput, setValidInput] = useState(true);
  const [isEditListName, setEditListName] = useState(false);
  const [valueOfListName, setValueOfListName] = useState(title);

  const changeListName = (e: ChangeEvent<HTMLInputElement>): void => {
    setValueOfListName(e.target.value);
  };

  const updateListName = (): void => {
    if (valueOfListName.match(boardInputRegex) && boardId !== undefined) {
      setValidInput(true);
      dispatch(editListName(+boardId, valueOfListName, id, position));
      setEditListName(false);
    } else setValidInput(false);
  };

  // work with modal window
  const [isVisibleModal, setVisibleModal] = useState(false);
  const [valueOfModal, setValueOfModal] = useState('');
  const toggleModal = (): void => {
    setVisibleModal(!isVisibleModal);
  };

  // work with create card
  const handleClickCreateCard = (): void => {
    if (valueOfModal.match(boardInputRegex) && boardId !== undefined) {
      dispatch(createCard(+boardId, valueOfModal, id, cards.length + 1));
      setValueOfModal('');
      setVisibleModal(false);
    }
  };

  // work with card move - drag-n-drop
  const [dragElement, setDragElement] = useState<HTMLDivElement | null>(null);
  const currentBoardLists = useSelector((state: AppState) => state.board.lists);
  const { card: dragCard, dragListID } = useSelector((state: AppState) => state.dragNDropItems);

  const replaceCard = (targetList: Lists, card?: ICard): void => {
    if (dragCard !== null) {
      const indexOfListDragedCard = currentBoardLists.findIndex((l) => l.id === dragListID);
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

          // Condition for avoiding dublication of cards
          let changedArrOfCards: ICard[] = [];
          if (targetList.id !== dragListID) {
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
          dispatch(replaceCardInList(changedArrOfList));
        }
      }
    }
  };

  const startDrag = (e: React.DragEvent<HTMLDivElement>, card: ICard, startDragList: Lists): void => {
    setDragElement(e.currentTarget);
    dispatch(setDragCard(card));
    dispatch(setDragStartListId(startDragList.id));
  };

  const dropHandler = (e: React.DragEvent<HTMLDivElement>, card: ICard, targetList: Lists): void => {
    e.preventDefault();
    replaceCard(targetList, card);
    if (dragElement?.classList.contains('slot')) {
      dragElement?.classList.remove('slot');
      dragElement?.classList.add('card');
      dragElement?.classList.remove('hidden-card');
    }
    e.currentTarget.classList.remove('slot-before');
    e.currentTarget.classList.remove('card-top');
  };
  const dropOverHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };
  const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    if (dragElement === e.currentTarget) {
      dragElement?.classList.add('slot');
      dragElement?.classList.remove('hidden-card');
    }
    dragElement?.classList.remove('card');
    if (dragElement !== e.currentTarget) {
      e.currentTarget.classList.add('slot-before');
      e.currentTarget.classList.add('card-top');
    }
  };
  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    dragElement?.classList.remove('slot');
    dragElement?.classList.add('hidden-card');
    e.currentTarget.classList.remove('slot-before');
    e.currentTarget.classList.remove('card-top');
  };
  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    dragElement?.classList.add('card');
    dragElement?.classList.remove('hidden-card');
    e.currentTarget.classList.remove('slot-before');
    e.currentTarget.classList.remove('card-top');
    setDragElement(null);
    dispatch(setDragCard(null));
    dispatch(setDragStartListId(null));
  };
  const containerDropHandler = (e: React.DragEvent<HTMLDivElement>, targetList: Lists): void => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('slot')) e.currentTarget.classList.add('last');
    replaceCard(targetList);
  };
  const containerDragEnterHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    if (e.currentTarget.classList.contains('last')) e.currentTarget.classList.remove('last');
  };
  const containerDragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    if (e.currentTarget.classList.contains('slot')) e.currentTarget.classList.add('last');
  };

  return (
    <div className="list">
      <div
        className="list-title-container"
        onClick={(): void => {
          setEditListName(true);
        }}
      >
        {isEditListName ? (
          <input
            type="text"
            className={isValidInput ? 'list-name-input' : 'list-name-input error'}
            value={valueOfListName}
            onChange={changeListName}
            onBlur={updateListName}
            onClick={(e): void => e.stopPropagation()}
            onKeyDown={(e: React.KeyboardEvent): void => {
              if (e.key === 'Enter') updateListName();
              if (e.key === 'Escape') setValueOfListName(title);
            }}
          />
        ) : (
          <h2>{title}</h2>
        )}
      </div>
      <div className="list-item-container">
        {cards
          .sort((a, b) => a.position - b.position)
          .map((card: ICard) => {
            return (
              <div
                key={card.id}
                draggable
                className="card"
                onDragOver={(e): void => dropOverHandler(e)}
                onDrop={(e): void => dropHandler(e, card, list)}
                onDragEnter={(e): void => dragEnterHandler(e)}
                onDragLeave={(e): void => dragLeaveHandler(e)}
                onDragStart={(e): void => startDrag(e, card, list)}
                onDragEnd={(e): void => dragEndHandler(e)}
              >
                <Card {...card} />
              </div>
            );
          })}
        <div
          className="slot last"
          onDragOver={(e): void => dropOverHandler(e)}
          onDrop={(e): void => containerDropHandler(e, list)}
          onDragEnter={(e): void => containerDragEnterHandler(e)}
          onDragLeave={(e): void => containerDragLeaveHandler(e)}
        />
      </div>
      <div className="btn-container">
        <button className="add-list" onClick={toggleModal}>
          +
        </button>
      </div>
      <Modal
        isVisibleModal={isVisibleModal}
        toggleModal={toggleModal}
        handleValueModal={setValueOfModal}
        handleClickCreateElement={handleClickCreateCard}
      />
    </div>
  );
}
