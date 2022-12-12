import React, { DragEvent, useState } from 'react';
import ICard from '../../../../common/interfaces/ICard';
import './card.scss';

export default function Card(props: ICard): JSX.Element {
  const { title } = props;
  const [isDragStart, toggleDragStart] = useState(false);
  const dragStartHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.dataTransfer.setData('text/html', e.target);
    // console.log(e.target);
  };
  return (
    <div className="card" draggable onDragStart={dragStartHandler}>
      <p>{title}</p>
    </div>
  );
}
