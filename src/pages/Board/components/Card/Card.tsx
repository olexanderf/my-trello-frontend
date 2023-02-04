/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { Location } from 'react-router-dom';
import ICard from '../../../../common/interfaces/ICard';
import './card.scss';

interface PropsType {
  card: ICard;
  state: { background: Location };
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
