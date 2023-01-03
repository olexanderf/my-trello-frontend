import React, { ChangeEvent, useEffect, useState } from 'react';
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
  const [dragCard, setDragCard] = useState<ICard | null>(null);
  const [dragElement, setDragElement] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    changeArrOfCards(cards);
  }, [cards]);

  const replaceCard = (card: ICard): ICard[] => {
    if (dragCard !== null && card !== undefined) {
      if (card.position < dragCard.position) {
        const prevDragPosition = dragCard.position;
        dragCard.position = card.position;
        return arrOfCards.map((cardInArr) => {
          if (
            cardInArr.position >= dragCard.position &&
            cardInArr.position < prevDragPosition &&
            cardInArr.id !== dragCard.id
          ) {
            return { ...cardInArr, position: cardInArr.position + 1 };
          }
          return cardInArr;
        });
      }
      if (card.position > dragCard.position) {
        const prevDragPosition = dragCard.position;
        dragCard.position = card.position;
        return arrOfCards.map((cardInArr) => {
          if (
            cardInArr.position <= dragCard.position &&
            cardInArr.position > prevDragPosition &&
            cardInArr.id !== dragCard.id
          ) {
            return { ...cardInArr, position: cardInArr.position - 1 };
          }
          return cardInArr;
        });
      }
    }
    return arrOfCards;
  };
  const startDrag = (e: React.DragEvent<HTMLDivElement>, card: ICard): void => {
    // e.currentTarget.classList.add('slot');
    // e.currentTarget.classList.remove('card');
    setDragElement(e.currentTarget);
    setDragCard(card);
    // console.log(e.currentTarget);
    // console.log(dragElement);
    // console.log('start drag');
  };
  const dropHandler = (e: React.DragEvent<HTMLDivElement>, card: ICard): void => {
    e.preventDefault();
    // console.log('drop');
    changeArrOfCards(replaceCard(card));
    if (dragElement?.classList.contains('slot')) {
      dragElement?.classList.remove('slot');
      dragElement?.classList.add('card');
      dragElement?.classList.remove('hidden-text');
    }
    // setDragElement(null);
    // setDragCard(null);
  };
  const dropOverHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };
  const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    if (dragElement === e.currentTarget) {
      dragElement?.classList.add('slot');
      dragElement?.classList.remove('hidden-text');
    }
    dragElement?.classList.remove('card');
    if (dragElement !== e.currentTarget) {
      e.currentTarget.classList.add('slot1');
    }
  };
  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    dragElement?.classList.remove('slot');
    dragElement?.classList.add('hidden-text');
    e.currentTarget.classList.remove('slot1');
    // console.log('drag leave');
  };
  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    dragElement?.classList.add('card');
    dragElement?.classList.remove('hidden-text');
    e.currentTarget.classList.remove('slot1');
    // console.log('drag end');
    setDragElement(null);
    setDragCard(null);
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
        // onDragOver={(e): void => dropOverHandler(e)}
        // onDrop={(e): void => dropHandler(e)}
      >
        {arrOfCards
          .sort((a, b) => a.position - b.position)
          .map((card: ICard) => {
            return (
              <div
                key={card.id}
                draggable
                className="card"
                onDragOver={(e): void => dropOverHandler(e)}
                onDrop={(e): void => dropHandler(e, card)}
                onDragEnter={(e): void => dragEnterHandler(e)}
                onDragLeave={(e): void => dragLeaveHandler(e)}
                onDragStart={(e): void => startDrag(e, card)}
                onDragEnd={(e): void => dragEndHandler(e)}
              >
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
