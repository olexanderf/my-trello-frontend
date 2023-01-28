import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ICard from '../../../../common/interfaces/ICard';
import './card.scss';

interface PropsType {
  card: ICard;
  boardId: number;
}

export default function Card(props: PropsType): JSX.Element {
  const { card, boardId } = props;
  const { title, id } = card;
  const location = useLocation();
  return (
    <div>
      <Link to={`/board/${boardId}/card/${id}`} state={{ background: location }}>
        <p className="card-text">{title}</p>
      </Link>
    </div>
  );
}
