import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../store/store';
import './cardCopyMoveModal.scss';

export default function CardCopyMoveModal(): JSX.Element {
  const boards = useSelector((state: AppState) => state.boards);
  const currentBoard = useSelector((state: AppState) => state.board);
  const currentList = useSelector((state: AppState) => state.cardEditModal.currentList);
  const currentCard = useSelector((state: AppState) => state.cardEditModal.cardOnModal);

  return (
    <div className="card-copy-move-modal-container">
      <h3 className="card-copy-move-modal-name">Copy/Move</h3>
      <form action="" id="copy-move-card">
        <label htmlFor="board-select">Доска:</label>
        <select name="board-select" id="board-select" form="copy-move-card">
          {boards.map((b) => {
            return (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            );
          })}
        </select>
        <label htmlFor="list-select">Список:</label>
        <select name="list-select" id="list-select" form="copy-move-card">
          {currentBoard.lists.map((l) => {
            return (
              <option key={l.id} value={l.position}>
                {l.title}
              </option>
            );
          })}
        </select>
        <label htmlFor="position-select">Позиция:</label>
        <select name="position-select" id="position-select" form="copy-move-card">
          {currentList.cards.map((c) => {
            return (
              <option key={c.id} value={c.position}>
                {c.position}
              </option>
            );
          })}
        </select>
        <br />
        <button className="card-copy-move-modal-btn" onClick={(e): void => e.preventDefault()}>
          Копировать/Переместить
        </button>
      </form>
    </div>
  );
}
