import React from 'react';
import randomColor from 'randomcolor';
import { Link } from 'react-router-dom';
import Board from '../../../../common/interfaces/Board';
import './board.scss';

export default function IconBoard(props: Board): JSX.Element {
  const { title } = props;
  const { id } = props;
  const color = randomColor();
  return (
    <Link to={`/board/${id}`}>
      <div className="board-on-table" style={{ backgroundColor: color }}>
        <p>{id}</p>
        <p>{title}</p>
      </div>
    </Link>
  );
}
