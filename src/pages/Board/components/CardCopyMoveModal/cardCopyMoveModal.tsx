import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UpdatedCards from '../../../../common/interfaces/UpdatedCards';
import { createCard, moveCards } from '../../../../store/modules/board/actions';
import { fetchBoardDate as fetchBoardData } from '../../../../store/modules/cardEditModal/action';
import { AppDispatch, AppState } from '../../../../store/store';
import './cardCopyMoveModal.scss';

interface PropsType {
  isCopy: boolean;
}

export default function CardCopyMoveModal(props: PropsType): JSX.Element {
  const { isCopy } = props;
  const { board_id: boardId } = useParams();
  const boards = useSelector((state: AppState) => state.boards);
  const currentBoard = useSelector((state: AppState) => state.cardEditModal.boardOnModal);
  const currentList = useSelector((state: AppState) => state.cardEditModal.listOnModal);
  const currentCard = useSelector((state: AppState) => state.cardEditModal.cardOnModal);
  const dispatch: AppDispatch = useDispatch();
  const [indexOfBoard, setIndexOfBoard] = useState(0);
  const [indexOfSelectedList, setIndexOfSelectedList] = useState(currentList.position - 1);
  const [selectedCardPosition, setSelectedCardPosition] = useState(currentCard.position);

  useEffect(() => {
    if (boardId !== undefined) setIndexOfBoard(boards.findIndex((b) => b.id === +boardId));
  }, []);

  const boardValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setIndexOfBoard(+e.target.value);
    if (boardId) {
      dispatch(fetchBoardData(boards[+e.target.value].id));
    }
  };

  const listValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setIndexOfSelectedList(+e.target.value);
  };
  const cardPositionHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCardPosition(+e.target.value);
  };
  const copyCard = (targetBoardId: number, targetListId: number, position: number): void => {
    dispatch(
      createCard(
        targetBoardId,
        currentCard.title,
        targetListId,
        position,
        currentCard?.description,
        currentCard?.custom
      )
    );
  };
  const submitForm = (): void => {
    if (isCopy) {
      if (
        selectedCardPosition > currentBoard.lists[indexOfSelectedList].cards.length ||
        (selectedCardPosition === 1 && currentBoard.lists[indexOfSelectedList].cards.length === 0)
      ) {
        copyCard(boards[indexOfBoard].id, currentBoard.lists[indexOfSelectedList].id, selectedCardPosition);
      } else {
        copyCard(boards[indexOfBoard].id, currentBoard.lists[indexOfSelectedList].id, selectedCardPosition);
        const cardsArr = currentBoard.lists[indexOfSelectedList].cards.map((c) => {
          if (selectedCardPosition === 1) return { ...c, position: c.position + 1 };
          if (selectedCardPosition >= c.position && selectedCardPosition > 1) {
            return { ...c, position: c.position + 1 };
          }
          return { ...c };
        });
        const newList = { ...currentBoard.lists[indexOfSelectedList], cards: cardsArr };
        const updatedListsArr = [...currentBoard.lists];
        updatedListsArr.splice(indexOfSelectedList, 1, newList);
        const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
          return { id: c.id, position: c.position, list_id: currentBoard.lists[indexOfSelectedList].id };
        });
        dispatch(moveCards(boards[indexOfBoard].id, arrUpdatedCards, updatedListsArr));
      }
    }
  };

  return (
    <div className="card-copy-move-modal-container">
      <h3 className="card-copy-move-modal-name">{isCopy ? 'Копировать' : 'Переместить'}</h3>
      <form
        action=""
        id="copy-move-card"
        onSubmit={(e): void => {
          e.preventDefault();
          submitForm();
        }}
      >
        <label htmlFor="board-select">Доска:</label>
        <select
          name="board-select"
          id="board-select"
          form="copy-move-card"
          value={indexOfBoard}
          onChange={(e): void => boardValueHandler(e)}
        >
          {boards &&
            boards.map((b, index) => {
              return (
                <option key={b.id} value={index}>
                  {b.title}
                </option>
              );
            })}
        </select>
        <label htmlFor="list-select">Список:</label>
        <select
          name="list-select"
          id="list-select"
          form="copy-move-card"
          value={indexOfSelectedList}
          onChange={(e): void => listValueHandler(e)}
        >
          {currentBoard.lists &&
            currentBoard.lists.map((l, index) => {
              return (
                <option key={l.id} value={index}>
                  {l.title}
                </option>
              );
            })}
        </select>
        <label htmlFor="position-select">Позиция:</label>
        <select
          name="position-select"
          id="position-select"
          form="copy-move-card"
          value={selectedCardPosition}
          onChange={(e): void => cardPositionHandler(e)}
        >
          {currentBoard.lists[indexOfSelectedList] ? (
            currentBoard.lists[indexOfSelectedList].cards.map((c) => {
              return (
                <option key={c.id} value={c.position}>
                  {c.position}
                </option>
              );
            })
          ) : (
            <option value={1}>{1}</option>
          )}
          {currentBoard.lists[indexOfSelectedList] && (
            <option value={currentBoard.lists[indexOfSelectedList].cards.length + 1}>
              {currentBoard.lists[indexOfSelectedList].cards.length + 1}
            </option>
          )}
        </select>
        <br />
        <button className="card-copy-move-modal-btn" type="submit">
          {isCopy ? 'Копировать' : 'Переместить'}
        </button>
      </form>
    </div>
  );
}
