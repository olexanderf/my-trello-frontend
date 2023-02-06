import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { boardInputRegex } from '../../../../common/constants/regExp';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import {
  setCardModal,
  setCurrentList,
  toggleCardEditModal,
  updateCard,
} from '../../../../store/modules/cardEditModal/action';
import { AppDispatch, AppState } from '../../../../store/store';
import CardCopyMoveModal from '../CardCopyMoveModal/cardCopyMoveModal';
import './cardModal.scss';

export default function CardModal(): JSX.Element {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { board_id: boardId, card_id: cardId } = useParams();
  const lists = useSelector((state: AppState) => state.board.lists);
  const currentList = useSelector((state: AppState) => state.cardEditModal.currentList);
  const currentCard = useSelector((state: AppState) => state.cardEditModal.cardOnModal);
  const [isEditCardTitle, setEditCardTitle] = useState(false);
  const [valueOfCardTitle, setValueOfCardTitle] = useState('');
  const [isValidInput, setValidInput] = useState(true);
  const [isEditCardDescription, setEditDescription] = useState(false);
  const [valueOfDescription, setValueOfDescription] = useState('');
  const [isVisibleCopyMoveModa, setVisibleCopyMoveModal] = useState(false);

  const loadCardData = (arrLists: Lists[], currentCardId: number): void => {
    let cardIndex = 0;
    const indexList = arrLists.findIndex((l) =>
      l.cards.find((c: ICard, index) => {
        if (c.id === currentCardId) {
          cardIndex = index;
          return c;
        }
        return undefined;
      })
    );
    if (arrLists !== undefined) {
      dispatch(setCurrentList(arrLists[indexList]));
      dispatch(setCardModal(arrLists[indexList].cards[cardIndex]));
    }
  };

  useEffect(() => {
    if (cardId !== undefined) loadCardData(lists, +cardId);
  }, []);

  useEffect(() => {
    setValueOfCardTitle(currentCard.title);
  }, [currentCard.title]);

  useEffect(() => {
    if (currentCard.description !== undefined) setValueOfDescription(currentCard.description);
    else setValueOfDescription('');
  }, [currentCard.description]);

  const onCardModalClose = (): void => {
    dispatch(toggleCardEditModal(false));
    navigate(`/board/${boardId}`);
  };

  const changeCardTitle = (e: ChangeEvent<HTMLInputElement>): void => {
    setValueOfCardTitle(e.target.value);
  };

  const changeDiscriptionValue = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setValueOfDescription(e.target.value);
  };

  const updateCardFields = (): void => {
    if (valueOfCardTitle.match(boardInputRegex) && boardId && cardId && valueOfCardTitle !== currentCard.title) {
      setValidInput(true);
      dispatch(updateCard(+boardId, +cardId, currentList.id, valueOfCardTitle));
      setEditCardTitle(false);
    }
    if (valueOfCardTitle.match(boardInputRegex) && valueOfCardTitle === currentCard.title) {
      setValidInput(true);
      setEditCardTitle(false);
    }
    if (!valueOfCardTitle.match(boardInputRegex)) setValidInput(false);

    if (
      valueOfCardTitle.match(boardInputRegex) &&
      boardId &&
      cardId &&
      valueOfDescription !== currentCard.description
    ) {
      if (valueOfDescription === '') {
        dispatch(updateCard(+boardId, +cardId, currentList.id, valueOfCardTitle, null));
      } else dispatch(updateCard(+boardId, +cardId, currentList.id, valueOfCardTitle, valueOfDescription));
      setEditCardTitle(false);
    }
    if (valueOfDescription === currentCard.description) {
      setEditCardTitle(false);
    }
  };

  const endEditTitle = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      updateCardFields();
      setEditCardTitle(false);
    }
    if (e.key === 'Escape') {
      setValueOfCardTitle(currentCard.title);
      setEditCardTitle(false);
    }
  };

  const endEditDescription = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      updateCardFields();
      setEditCardTitle(false);
    }
    if (e.key === 'Escape' && currentCard.description !== undefined) {
      setValueOfDescription(currentCard.description);
      setEditCardTitle(false);
    }
  };

  return (
    <div>
      <div className="card-modal-container">
        <div className="card-modal-container-main">
          {isEditCardTitle ? (
            <input
              type="text"
              className={isValidInput ? 'card-modal-input' : 'card-modal-input error'}
              value={valueOfCardTitle}
              onClick={(e): void => e.stopPropagation()}
              onChange={changeCardTitle}
              onBlur={(): void => {
                if (valueOfCardTitle.match(boardInputRegex)) {
                  updateCardFields();
                  setEditCardTitle(false);
                } else setValidInput(false);
              }}
              onKeyDown={(e: React.KeyboardEvent): void => {
                endEditTitle(e);
              }}
            />
          ) : (
            <h1
              className="card-modal-title"
              onClick={(e: React.MouseEvent): void => {
                setEditCardTitle(true);
                e.stopPropagation();
              }}
            >
              {currentCard.title}
            </h1>
          )}
          <span className="card-modal-list-name">
            В колонке: <span>{currentList.title}</span>
          </span>
          <div className="card-modal-members">
            <h4 className="card-modal-users-title">Участники:</h4>
            <div className="card-modal-users-container">
              <div className="card-modal-users-icon" />
              <div className="card-modal-users-icon" />
              <div className="card-modal-users-icon" />
              <button className="card-modal-users-icon invite">+</button>
              <button className="card-modal-btn-join-member">Присоедениться</button>
            </div>
          </div>
          <div className="card-modal-description">
            <div className="card-modal-description-header-container">
              <h4 className="card-modal-description-header">Описание</h4>
              <button
                className="card-modal-description-btn-edit"
                onClick={(e: React.MouseEvent): void => {
                  setEditDescription(true);
                  e.stopPropagation();
                }}
              >
                Изменить
              </button>
            </div>
            {isEditCardDescription ? (
              <textarea
                className="card-modal-description-edit"
                value={valueOfDescription}
                onChange={changeDiscriptionValue}
                onClick={(e: React.MouseEvent): void => {
                  e.stopPropagation();
                }}
                onBlur={(): void => {
                  updateCardFields();
                  setEditDescription(false);
                }}
                onKeyDown={(e: React.KeyboardEvent): void => {
                  endEditDescription(e);
                }}
              />
            ) : (
              <p className="card-modal-desctiption-text">{currentCard.description}</p>
            )}
          </div>
        </div>
        <div className="card-modal-actions-container">
          <h4 className="card-modal-actions-header">Действия</h4>
          <button
            className="card-modal-actions-btn"
            onClick={(): void => setVisibleCopyMoveModal(!isVisibleCopyMoveModa)}
          >
            Копировать
          </button>
          <button
            className="card-modal-actions-btn"
            onClick={(): void => setVisibleCopyMoveModal(!isVisibleCopyMoveModa)}
          >
            Перемещение
          </button>
          <button className="card-modal-actions-btn archive">Архивация</button>
        </div>
        <button className="card-modal-btn-close" onClick={(): void => onCardModalClose()}>
          +
        </button>
      </div>
      {isVisibleCopyMoveModa ? <CardCopyMoveModal /> : ''}
      <div className="gray-background-box" onClick={(): void => onCardModalClose()} />
    </div>
  );
}
