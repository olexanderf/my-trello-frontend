import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AnyAction } from 'redux';
import { boardInputRegex } from '../../../../common/constants/regExp';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import UpdatedLists from '../../../../common/interfaces/UpdatedLists';
import dragCardMover from '../../../../common/tools/cardMover';
import {
  createCard,
  deleteListAction,
  editListName,
  moveCards,
  updateListsPositionAction,
} from '../../../../store/modules/board/actions';
import { getBoards } from '../../../../store/modules/boards/actions';
import { toggleCardEditModal } from '../../../../store/modules/cardEditModal/action';
import { setDragCard, setDragStartListId } from '../../../../store/modules/dragNdrop/action';
import { AppDispatch, AppState } from '../../../../store/store';
import Modal from '../../../../common/components/NewElementModal/NewElementModal';
import Card from '../Card/Card';
import './list.scss';

interface PropsType {
  list: Lists;
}

export default function List({ list }: PropsType): JSX.Element {
  const { title, cards, id, position } = list;
  const { board_id: boardId, card_id: cardId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const isVisibleCardModal = useSelector((state: AppState) => state.cardEditModal.isVisibleCardModalEdit);
  const listsArr = useSelector((state: AppState) => state.board.lists);

  // work with list name change
  const [isValidInput, setValidInput] = useState(true);
  const [isEditListName, setEditListName] = useState(false);
  const [valueOfListName, setValueOfListName] = useState(title);

  // show card modal edit after reload page
  useEffect(() => {
    dispatch(getBoards());
    if (cardId !== undefined && !isVisibleCardModal) dispatch(toggleCardEditModal(true));
  }, []);

  const changeListName = (e: ChangeEvent<HTMLInputElement>): void => {
    setValueOfListName(e.target.value);
  };

  const updateListName = (): void => {
    if (valueOfListName.match(boardInputRegex) && boardId !== undefined && valueOfListName !== title) {
      setValidInput(true);
      dispatch(editListName(+boardId, valueOfListName, id, position));
      setEditListName(false);
    }
    if (valueOfListName.match(boardInputRegex) && valueOfListName === title) {
      setValidInput(true);
      setEditListName(false);
    }
    if (!valueOfListName.match(boardInputRegex)) setValidInput(false);
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
    const { arrUpdatedCards, changedArrOfList } = dragCardMover(
      targetList,
      currentBoardLists,
      dragListID,
      dragCard,
      card
    );
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
    if (dragCard && dragElement === e.currentTarget) {
      dragElement?.classList.add('slot');
      dragElement?.classList.remove('hidden-card');
    }
    dragElement?.classList.remove('card');
    if (dragCard && dragElement !== e.currentTarget) {
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
    const { arrUpdatedCards, changedArrOfList } = dragCardMover(targetList, currentBoardLists, dragListID, dragCard);
    if (boardId !== undefined) {
      dispatch(moveCards(+boardId, arrUpdatedCards, changedArrOfList));
    }
  };
  const containerDragEnterHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    if (dragCard && e.currentTarget.classList.contains('last')) e.currentTarget.classList.remove('last');
  };
  const containerDragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    if (e.currentTarget.classList.contains('slot')) e.currentTarget.classList.add('last');
  };
  const updateListsPosition = (arrLists: Lists[], listId: number): void => {
    const newLists = arrLists
      .filter((l) => l.id !== listId)
      .map((l, index) => {
        return { ...l, position: index + 1 };
      });
    const updatedLists: UpdatedLists[] = newLists.map((l) => {
      return { id: l.id, position: l.position };
    });
    if (boardId) dispatch(updateListsPositionAction(+boardId, listId, updatedLists));
  };

  const deleteList = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (boardId && position === listsArr.length) {
      dispatch(deleteListAction(+boardId, id));
    } else updateListsPosition(listsArr, id);
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
            onBlur={(): void => {
              updateListName();
              setEditListName(false);
            }}
            onClick={(e): void => e.stopPropagation()}
            onKeyDown={(e: React.KeyboardEvent): void => {
              if (e.key === 'Enter') {
                updateListName();
                setEditListName(false);
              }
              if (e.key === 'Escape') {
                setValueOfListName(title);
                setEditListName(false);
              }
            }}
          />
        ) : (
          <>
            <h2>{title}</h2>
            <button className="list-btn-delete" onClick={deleteList}>
              +
            </button>
          </>
        )}
      </div>
      <div className="list-item-container">
        {cards &&
          cards
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
                  <Link
                    to={`/board/${boardId}/card/${card.id}`}
                    onClick={(): AnyAction => dispatch(toggleCardEditModal(true))}
                  >
                    <Card card={card} state={{ background: location }} />
                  </Link>
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
      <div className="add-item-container">
        <button className="add-item" onClick={toggleModal}>
          +
        </button>
      </div>
      {isVisibleModal && (
        <Modal
          toggleModal={toggleModal}
          handleValueModal={setValueOfModal}
          handleClickCreateElement={handleClickCreateCard}
        />
      )}
    </div>
  );
}
