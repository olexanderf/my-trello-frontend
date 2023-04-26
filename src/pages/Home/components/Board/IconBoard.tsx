import React, { ReactElement, useEffect } from 'react';
import randomColor from 'randomcolor';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Board from '../../../../common/interfaces/Board';
import './iconBoard.scss';
import { TypedDispatch } from '../../../../store/store';
import { setColorIconBoard } from '../../../../store/modules/boards/actions';

type PropsType = {
  board: Board;
  handleClickDeleteBoard: (id: number) => void;
};

export default function IconBoard({ handleClickDeleteBoard, board }: PropsType): ReactElement {
  const { title, id, custom } = board;
  const color = randomColor();
  const dispatch: TypedDispatch = useDispatch();
  useEffect(() => {
    if (!custom?.color && id) dispatch(setColorIconBoard(id, color));
  }, []);
  return (
    <div className="board-on-table-container">
      <Link to={`/board/${id}`}>
        <div className="board-on-table" style={{ backgroundColor: custom?.color }}>
          <p>{title}</p>
        </div>
      </Link>
      <button
        className="btn-delete"
        onClick={(): void => {
          handleClickDeleteBoard(id);
        }}
      >
        +
      </button>
    </div>
  );
}
