/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useState } from 'react';
import { boardInputRegex } from '../../../../common/constants/regExp';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import Card from '../Card/Card';
import './list.scss';

type PropsType = {
  list: Lists;
  key: number;
};

export default function List(props: PropsType): JSX.Element {
  const { title, cards } = props.list;
  const { key: board_id } = props;
  // work with list name change
  const [isEditListName, setEditListName] = useState(false);
  const [valueOfListName, setValueOfListName] = useState(title);

  const changeListName = (e: ChangeEvent<HTMLInputElement>) => {
    setValueOfListName(e.target.value);
  };
  const updateListName = () => {
    if (valueOfListName.match(boardInputRegex) && board_id !== undefined) {
    }
    setEditListName(false);
  };

  return (
    <div
      className="list"
      onClick={(): void => {
        setEditListName(true);
      }}
    >
      {isEditListName ? (
        <input type="text" value={valueOfListName} onChange={changeListName} onBlur={updateListName} />
      ) : (
        <h2>{title}</h2>
      )}

      {cards.map((card: ICard, index: number) => {
        return Card(cards[index].title);
      })}
      <div className="btn-container">
        <button className="add-list">+</button>
      </div>
    </div>
  );
}
