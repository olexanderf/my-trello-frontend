import React from 'react';
import ICard from '../../../../common/interfaces/ICard';
import './card.scss';

export default function Card(props: ICard): JSX.Element {
  const { title } = props;
  return (
    <div>
      <p className="card-text">{title}</p>
    </div>
  );
}
