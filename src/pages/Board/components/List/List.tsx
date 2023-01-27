import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { boardInputRegex } from '../../../../common/constants/regExp';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import cardMover from '../../../../common/tools/cardMover';
import { createCard, editListName, moveCards } from '../../../../store/modules/board/actions';
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

  // data for card move - drag-n-drop
  const [dragElement, setDragElement] = useState<HTMLDivElement | null>(null);
  const currentBoardLists = useSelector((state: AppState) => state.board.lists);
  const { card: dragCard, dragListID } = useSelector((state: AppState) => state.dragNDropItems);

  const startDrag = (e: React.DragEvent<HTMLDivElement>, card: ICard, startDragList: Lists): void => {
    setDragElement(e.currentTarget);
    dispatch(setDragCard(card));
    dispatch(setDragStartListId(startDragList.id));
  };

  const dropHandler = (e: React.DragEvent<HTMLDivElement>, card: ICard, targetList: Lists): void => {
    e.preventDefault();
    const { arrUpdatedCards, changedArrOfList } = cardMover(targetList, currentBoardLists, dragListID, dragCard, card);
    if (boardId !== undefined) {
      dispatch(moveCards(+boardId, arrUpdatedCards, changedArrOfList));
    }
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
    const { arrUpdatedCards, changedArrOfList } = cardMover(targetList, currentBoardLists, dragListID, dragCard);
    if (boardId !== undefined) {
      dispatch(moveCards(+boardId, arrUpdatedCards, changedArrOfList));
    }
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
      {isVisibleModal ? (
        <Modal
          toggleModal={toggleModal}
          handleValueModal={setValueOfModal}
          handleClickCreateElement={handleClickCreateCard}
        />
      ) : (
        ''
      )}
    </div>
  );
}
