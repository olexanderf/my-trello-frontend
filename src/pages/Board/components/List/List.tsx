/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import Card from '../Card/Card';
import './list.scss';

export default function List(props: Lists): JSX.Element {
  const { title } = props;
  const { cards } = props;
  return (
    <div className="list">
      <h2>{title}</h2>
      {cards.map((card: ICard, index: number) => {
        return Card(cards[index].title);
      })}
      <div className="btn-container">
        <button className="add-list">+</button>
      </div>
    </div>
  );
}
