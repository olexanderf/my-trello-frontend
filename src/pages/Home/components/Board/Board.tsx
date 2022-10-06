import React from 'react';
import randomColor from 'randomcolor';
import Board from '../../../../common/interfaces/Board';
import './board.scss';

export default function IconBoard(props: Board): JSX.Element {
  const { title } = props;
  const color = randomColor();
  return (
    <div className="board-on-table" style={{ backgroundColor: color }}>
      <p>{title}</p>
    </div>
  );
}
