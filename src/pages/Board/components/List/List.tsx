import React, { ChangeEvent, createRef, Ref, useCallback, useEffect, useRef, useState } from 'react';
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

  // Create dynamically ref code taken from gitHub https://gist.github.com/whoisryosuke/06f91d7cbcaa76b969bb73576062bb83
  const [cardsHeight, setCardsHeight] = useState([]);
  const cardRef = useRef(arrOfCards.map(() => createRef()));

  useEffect(() => {
    const nextCardHeight = cardRef.current.map((ref) => {
      return ref.current.getBoundingClientRect().height;
    });
    setCardsHeight(nextCardHeight);
  }, []);

  const startDrag = (e: React.DragEvent<HTMLDivElement>, card: ICard): void => {
    setDragElement(e.currentTarget);
    setDragCard(card);
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
    e.currentTarget.classList.remove('slot1');
    // e.currentTarget.classList.remove('card-top');
    e.currentTarget.style.top = '';
  };
  const dropOverHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };
  const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>, index: number): void => {
    if (dragElement === e.currentTarget) {
      dragElement?.classList.add('slot');
      dragElement?.classList.remove('hidden-text');
    }
    dragElement?.classList.remove('card');
    if (dragElement !== e.currentTarget) {
      e.currentTarget.classList.add('slot1');
      e.currentTarget.style.top = `${e.currentTarget.style.top + cardsHeight[index + 1]}px`;
      // e.currentTarget.style.bottom += cardsHeight[index + 1];
      // console.log(cardsHeight[index + 1]);
    }
  };
  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    dragElement?.classList.remove('slot');
    dragElement?.classList.add('hidden-text');
    // e.currentTarget.classList.remove('slot1');
    // e.currentTarget.style.marginTop = '';
    // e.currentTarget.classList.remove('card-top');
    // console.log('drag leave');
  };
  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    dragElement?.classList.add('card');
    dragElement?.classList.remove('hidden-text');
    e.currentTarget.classList.remove('slot1');
    e.currentTarget.style.top = '';
    // e.currentTarget.classList.remove('card-top');
    setDragElement(null);
    setDragCard(null);
  };
  const containerDropHandler = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
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
        onDragOver={(e): void => dropOverHandler(e)}
        onDrop={(e): void => containerDropHandler(e)}
      >
        {arrOfCards
          .sort((a, b) => a.position - b.position)
          .map((card: ICard, index: number) => {
            return (
              <div
                key={card.id}
                ref={cardRef.current[index]}
                draggable
                className="card"
                onDragOver={(e): void => dropOverHandler(e)}
                onDrop={(e): void => dropHandler(e, card)}
                onDragEnter={(e): void => dragEnterHandler(e, index)}
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
