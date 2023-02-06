import React from 'react';
import './cardCopyMoveModal.scss';

export default function CardCopyMoveModal(): JSX.Element {
  return (
    <div className="card-copy-move-modal-container">
      <h3 className="card-copy-move-modal-name">Copy/Move</h3>
      <form action="" id="copy-move-card">
        <label htmlFor="board-select">Доска:</label>
        <select name="board-select" id="board-select" form="copy-move-card">
          <option value="boardName1">Название доски 1</option>
          <option value="boardName2">Название доски 2</option>
        </select>
        <label htmlFor="list-select">Список:</label>
        <select name="list-select" id="list-select" form="copy-move-card">
          <option value="listName1">Название списка 1</option>
          <option value="listName2">Название списка 2</option>
        </select>
        <label htmlFor="position-select">Позиция:</label>
        <select name="position-select" id="position-select" form="copy-move-card">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <br />
        <button className="card-copy-move-modal-btn" onClick={(e): void => e.preventDefault()}>
          Копировать/Переместить
        </button>
      </form>
    </div>
  );
}
