import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchBoardDate } from '../../../../store/modules/cardEditModal/action';
import { AppDispatch, AppState } from '../../../../store/store';
import './cardCopyMoveModal.scss';

export default function CardCopyMoveModal(): JSX.Element {
  const { board_id: boardId } = useParams();
  const boards = useSelector((state: AppState) => state.boards);
  const currentBoard = useSelector((state: AppState) => state.cardEditModal.boardOnModal);
  const currentList = useSelector((state: AppState) => state.cardEditModal.listOnModal);
  const currentCard = useSelector((state: AppState) => state.cardEditModal.cardOnModal);
  const dispatch: AppDispatch = useDispatch();
  const [indexOfBoard, setIndexOfBoard] = useState(0);
  const [selectedList, setSelectedList] = useState(currentList.position);
  const [selectedCardPosition, setSelectedCardPosition] = useState(currentCard.position);

  useEffect(() => {
    if (boardId !== undefined) setIndexOfBoard(boards.findIndex((b) => b.id === +boardId));
  }, []);

  const boardValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setIndexOfBoard(+e.target.value);
    if (boardId) {
      dispatch(fetchBoardDate(boards[+e.target.value].id));
    }
  };

  const listValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedList(+e.target.value);
  };
  const cardPositionHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedCardPosition(+e.target.value);
  };

  return (
    <div className="card-copy-move-modal-container">
      <h3 className="card-copy-move-modal-name">Copy/Move</h3>
      <form action="" id="copy-move-card">
        <label htmlFor="board-select">Доска:</label>
        <select
          name="board-select"
          id="board-select"
          form="copy-move-card"
          value={indexOfBoard}
          onChange={boardValueHandler}
        >
          {boards.map((b, index) => {
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
          value={selectedList}
          onChange={listValueHandler}
        >
          {currentBoard.lists ? (
            currentBoard.lists.map((l) => {
              return (
                <option key={l.id} value={l.position}>
                  {l.title}
                </option>
              );
            })
          ) : (
            <option value={1}>{1}</option>
          )}
        </select>
        <label htmlFor="position-select">Позиция:</label>
        <select
          name="position-select"
          id="position-select"
          form="copy-move-card"
          value={selectedCardPosition}
          onChange={cardPositionHandler}
        >
          {currentBoard.lists[selectedList] ? (
            currentBoard.lists[selectedList].cards.map((c) => {
              return (
                <option key={c.id} value={c.position}>
                  {c.position}
                </option>
              );
            })
          ) : (
            <option value={1}>{1}</option>
          )}
          {currentBoard.lists[selectedList] ? (
            <option value={currentBoard.lists[selectedList].cards.length + 1}>
              {currentBoard.lists[selectedList].cards.length + 1}
            </option>
          ) : (
            ''
          )}
        </select>
        <br />
        <button className="card-copy-move-modal-btn" onClick={(e): void => e.preventDefault()}>
          Копировать/Переместить
        </button>
      </form>
    </div>
  );
}
