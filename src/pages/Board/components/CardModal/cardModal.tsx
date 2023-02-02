import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { boardInputRegex } from '../../../../common/constants/regExp';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import { toggleCardEditModal } from '../../../../store/modules/cardEditModal/action';
import { AppDispatch, AppState } from '../../../../store/store';
import './cardModal.scss';

export default function CardModal(): JSX.Element {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { board_id: boardId, card_id: cardId } = useParams();
  const lists = useSelector((state: AppState) => state.board.lists);
  const [currentList, setCurrentList] = useState<Lists>({ id: 0, title: 'demo', position: 0, cards: [] });
  const [currentCard, setCurrentCard] = useState<ICard>({
    id: 0,
    title: 'demo',
    list_id: 0,
    position: 0,
    description: 'demo descript',
  });
  const [isEditCardTitle, setEditCardTitle] = useState(false);
  const [valueOfCardTitle, setValueOfCardTitle] = useState('');
  const [isValidInput, setValidInput] = useState(true);

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
      setCurrentList(arrLists[indexList]);
      setCurrentCard(arrLists[indexList].cards[cardIndex]);
      setValueOfCardTitle(currentCard.title);
    }
  };

  useEffect(() => {
    if (cardId !== undefined) loadCardData(lists, +cardId);
  }, []);

  const onCardModalClose = (): void => {
    dispatch(toggleCardEditModal(false));
    navigate(`/board/${boardId}`);
  };

  const changeCardTitle = (e: ChangeEvent<HTMLInputElement>): void => {
    setValueOfCardTitle(e.target.value);
  };

  const updateCardTitle = (): void => {
    if (valueOfCardTitle.match(boardInputRegex) && boardId && cardId && valueOfCardTitle !== currentCard.title) {
      setValidInput(true);
      // dispatch();
      setEditCardTitle(false);
    }
    if (valueOfCardTitle.match(boardInputRegex) && valueOfCardTitle === currentCard.title) {
      setValidInput(true);
      setEditCardTitle(false);
    }
    if (!valueOfCardTitle.match(boardInputRegex)) setValidInput(false);
  };
  return (
    <div>
      <div className="card-modal-container">
        <div
          className="card-modal-container-main"
          onClick={(): void => {
            setEditCardTitle(true);
          }}
        >
          {isEditCardTitle ? (
            <input
              type="text"
              className={isValidInput ? 'card-modal-input' : 'card-modal-input error'}
              value={valueOfCardTitle}
              onClick={(e): void => e.stopPropagation()}
              onChange={changeCardTitle}
              onBlur={(): void => {
                updateCardTitle();
                setEditCardTitle(false);
              }}
              onKeyDown={(e: React.KeyboardEvent): void => {
                if (e.key === 'Enter') {
                  updateCardTitle();
                  setEditCardTitle(false);
                }
                if (e.key === 'Escape') {
                  setValueOfCardTitle(currentCard.title);
                  setEditCardTitle(false);
                }
              }}
            />
          ) : (
            <h1 className="card-modal-title">{currentCard.title}</h1>
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
              <button className="card-modal-description-btn-edit">Изменить</button>
            </div>
            <p className="card-modal-desctiption-text">{currentCard.description}</p>
          </div>
        </div>
        <div className="card-modal-actions-container">
          <h4 className="card-modal-actions-header">Действия</h4>
          <button className="card-modal-actions-btn">Копировать</button>
          <button className="card-modal-actions-btn">Перемещение</button>
          <button className="card-modal-actions-btn archive">Архивация</button>
        </div>
        <button className="card-modal-btn-close" onClick={(): void => onCardModalClose()}>
          +
        </button>
      </div>
      <div className="gray-background-box" onClick={(): void => onCardModalClose()} />
    </div>
  );
}
