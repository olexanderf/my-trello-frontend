/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import Card from '../Card/Card';
import './list.scss';

type PropsType = {
  list: Lists;
}

export default function List(props: PropsType): JSX.Element {
  const { title } = props.list;
  const { cards } = props.list;
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
