import React, { ReactElement } from 'react';
import randomColor from 'randomcolor';
import { Link } from 'react-router-dom';
import Board from '../../../../common/interfaces/Board';
import './iconBoard.scss';

type PropsType = {
  board: Board;
  handleClickDeleteBoard: (id: number) => void;
};

export default function IconBoard(props: PropsType): ReactElement {
  const { handleClickDeleteBoard, board } = props;
  const { title, id } = board;
  const color = randomColor();
  return (
    <div className="board-on-table-container">
      <Link to={`/board/${id}`}>
        <div className="board-on-table" style={{ backgroundColor: color }}>
          <p>{title}</p>
        </div>
      </Link>
      <button
        className="btn-delete"
        onClick={(): void => {
          handleClickDeleteBoard(id);
        }}
      >
        X
      </button>
    </div>
  );
}
