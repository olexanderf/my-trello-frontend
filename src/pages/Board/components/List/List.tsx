import React, { ChangeEvent, HtmlHTMLAttributes, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { boardInputRegex } from '../../../../common/constants/regExp';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import { createCard, editListName } from '../../../../store/modules/board/actions';
import { AppDispatch } from '../../../../store/store';
import Modal from '../../../Multipurpose/Modal/Modal';
import Card from '../Card/Card';
import './list.scss';

type PropsType = {
  list: Lists;
};

export default function List(props: PropsType): JSX.Element {
  const { list } = props;
  const { title, cards, id, position } = list;
  const { board_id: boardId } = useParams();
  const dispatch: AppDispatch = useDispatch();

  // work with list name change
  const [isValidInput, setValidInput] = useState(true);
  const [isEditListName, setEditListName] = useState(false);
  const [valueOfListName, setValueOfListName] = useState(title);

  const changeListName = (e: ChangeEvent<HTMLInputElement>): void => {
    setValueOfListName(e.target.value);
  };

  const updateListName = (): void => {
    if (valueOfListName.match(boardInputRegex) && boardId !== undefined) {
      setValidInput(true);
      dispatch(editListName(+boardId, valueOfListName, id, position));
      setEditListName(false);
    } else setValidInput(false);
  };

  // work with modal window
  const [isVisibleModal, setVisibleModal] = useState(false);
  const [valueOfModal, setValueOfModal] = useState('');
  const toggleModal = (): void => {
    setVisibleModal(!isVisibleModal);
  };

  // work with create card
  const handleClickCreateCard = (): void => {
    if (valueOfModal.match(boardInputRegex) && boardId !== undefined) {
      dispatch(createCard(+boardId, valueOfModal, id, cards.length + 1));
      setValueOfModal('');
      setVisibleModal(false);
    }
  };

  // work with card move
  const [arrOfCards, changeArrOfCards] = useState(cards);
  useEffect(() => {
    changeArrOfCards(cards);
  }, [cards]);

  // const startDrag = (card: ICard): void => {
  //   const { position: slotPosition, title: slotTitle } = card;
  //   const slotCard = { position: slotPosition, title: slotTitle, slot: true };
  //   const arr = arrOfCards.filter((el) => el.id !== card.id);
  //   changeArrOfCards([...arr, slotCard]);
  // };
  const startDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.target.classList.remove('card');
    e.target.classList.add('slot');
  };
  const dropOverHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.target.classList.add('card');
    e.target.classList.remvoe('slot');
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.dropEffect = 'move';
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
            className={isValidInput ? 'list-name-input' : 'list-name-input error'}
            value={valueOfListName}
            onChange={changeListName}
            onBlur={updateListName}
            onClick={(e): void => e.stopPropagation()}
            onKeyDown={(e: React.KeyboardEvent): void => {
              if (e.key === 'Enter') updateListName();
              if (e.key === 'Escape') setValueOfListName(title);
            }}
          />
        ) : (
          <h2>{title}</h2>
        )}
      </div>
      <div
        className="list-item-container"
        onDragOver={(e): void => e.preventDefault()}
        onDrop={(e): void => dropOverHandler(e)}
      >
        {arrOfCards
          .sort((a, b) => a.position - b.position)
          .map((card: ICard) => {
            return (
              <div key={card.id} className="card" draggable onDragStart={(e): void => startDrag(e)}>
                <Card {...card} />
              </div>
            );
          })}
      </div>
      <div className="btn-container">
        <button className="add-list" onClick={toggleModal}>
          +
        </button>
      </div>
      <Modal
        isVisibleModal={isVisibleModal}
        toggleModal={toggleModal}
        handleValueModal={setValueOfModal}
        handleClickCreateElement={handleClickCreateCard}
      />
    </div>
  );
}
