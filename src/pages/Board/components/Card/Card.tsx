import React from 'react';
import ICard from '../../../../common/interfaces/ICard';
import './card.scss';

interface PropsType {
  card: ICard;
}

export default function Card(props: PropsType): JSX.Element {
  const { card } = props;
  const { title } = card;
  return (
    <div>
      <p className="card-text">{title}</p>
    </div>
  );
}
