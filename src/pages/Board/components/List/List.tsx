/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { boardInputRegex } from '../../../../common/constants/regExp';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import { editListName } from '../../../../store/modules/board/actions';
import store from '../../../../store/store';
import Card from '../Card/Card';
import './list.scss';

type PropsType = {
  list: Lists;
  key: number;
};

export default function List(props: PropsType): JSX.Element {
  const { title, cards, id, position } = props.list;
  const { board_id } = useParams();

  // work with list name change
  const [isEditListName, setEditListName] = useState(false);
  const [valueOfListName, setValueOfListName] = useState(title);

  const changeListName = (e: ChangeEvent<HTMLInputElement>) => {
    setValueOfListName(e.target.value);
  };

  const updateListName = () => {
    if (valueOfListName.match(boardInputRegex) && board_id !== undefined) {
      store.dispatch(editListName(+board_id, valueOfListName, id, position));
    }
    setEditListName(false);
  };

  return (
    <div className="list">
      <div
        className="list-title-container"
        onClick={(): void => {
          setEditListName(true);
        }}
      >
        {isEditListName ? (
          <input
            type="text"
            className="list-name-input"
            value={valueOfListName}
            onChange={changeListName}
            onBlur={updateListName}
            onClick={(e): void => e.stopPropagation()}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter') updateListName();
            }}
          />
        ) : (
          <h2>{title}</h2>
        )}
      </div>

      {cards.map((card: ICard, index: number) => {
        return Card(cards[index].title);
      })}
      <div className="btn-container">
        <button className="add-list">+</button>
      </div>
    </div>
  );
}
