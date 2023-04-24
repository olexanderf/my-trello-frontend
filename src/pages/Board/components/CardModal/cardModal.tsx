import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { boardInputRegex } from '../../../../common/constants/regExp';
import ICard from '../../../../common/interfaces/ICard';
import Lists from '../../../../common/interfaces/Lists';
import UpdatedCards from '../../../../common/interfaces/UpdatedCards';
import { moveCards } from '../../../../store/modules/board/actions';
import {
  deleteCardAction,
  setBoardOnModal,
  setCardModal,
  setListOnModal,
  toggleCardEditModal,
  updateCard,
} from '../../../../store/modules/cardEditModal/action';
import { AppDispatch, AppState } from '../../../../store/store';
import CardCopyMoveModal from '../CardCopyMoveModal/cardCopyMoveModal';
import './cardModal.scss';
import LinkComponent from './LinkComponent/LinkComponent';
import { deleteCardFromList, replaceCardsInList } from '../../../../common/tools/cardMover';

export default function CardModal(): JSX.Element {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { board_id: boardId, card_id: cardId } = useParams();
  const board = useSelector((state: AppState) => state.board);
  const currentList = useSelector((state: AppState) => state.cardEditModal.listOnModal);
  const currentCard = useSelector((state: AppState) => state.cardEditModal.cardOnModal);
  const [isEditCardTitle, setEditCardTitle] = useState(false);
  const [valueOfCardTitle, setValueOfCardTitle] = useState('');
  const [isValidInput, setValidInput] = useState(true);
  const [isEditCardDescription, setEditDescription] = useState(false);
  const [valueOfDescription, setValueOfDescription] = useState('');
  const [isVisibleCopyMoveModal, setVisibleCopyMoveModal] = useState(false);
  const [isCopyCard, setCopyCard] = useState(false);

  const onCardModalClose = (): void => {
    dispatch(toggleCardEditModal(false));
    navigate(`/board/${boardId}`);
  };

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
    if (arrLists && indexList !== -1) {
      dispatch(setListOnModal(arrLists[indexList]));
      dispatch(setCardModal(arrLists[indexList].cards[cardIndex]));
    } else onCardModalClose();
  };

  useEffect(() => {
    if (cardId !== undefined) loadCardData(board.lists, +cardId);
    dispatch(setBoardOnModal(board));
  }, []);

  useEffect(() => {
    if (currentCard.description !== undefined) setValueOfDescription(currentCard.description);
    else setValueOfDescription('');
    setValueOfCardTitle(currentCard.title);
  }, [currentCard.description, currentCard.title]);

  const changeCardTitle = (e: ChangeEvent<HTMLInputElement>): void => {
    setValueOfCardTitle(e.target.value);
  };

  const changeDescriptionValue = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setValueOfDescription(e.target.value);
  };

  const updateCardFields = (): void => {
    if (boardId && cardId && valueOfCardTitle.match(boardInputRegex)) {
      dispatch(updateCard(+boardId, +cardId, currentList.id, valueOfCardTitle, valueOfDescription));
      setValidInput(true);
    }
    setValidInput(false);
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
      setEditDescription(false);
    }
    if (e.key === 'Escape' && currentCard.description !== undefined) {
      setValueOfDescription(currentCard.description);
      setEditDescription(false);
    }
  };
  const updateCardsPositionInList = (currentBoardId: number, card: ICard): void => {
    const cardsArr = deleteCardFromList(card, board.lists, currentList.position - 1);
    const updatedListsArr = replaceCardsInList(
      board.lists,
      board.lists[currentList.position - 1],
      cardsArr,
      currentList.position - 1
    );
    const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
      return { id: c.id, position: c.position, list_id: currentList.id };
    });
    dispatch(moveCards(currentBoardId, arrUpdatedCards, updatedListsArr));
  };

  const cardBtnArchiveHandler = async (): Promise<void> => {
    if (boardId && cardId) {
      if (currentCard.position !== currentList.cards.length) await updateCardsPositionInList(+boardId, currentCard);
      await dispatch(deleteCardAction(+boardId, +cardId));
    }
  };

  const cardModalContainerHandler = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (isVisibleCopyMoveModal) setVisibleCopyMoveModal(false);
  };

  return (
    <div>
      <div className="card-modal-container" onClick={cardModalContainerHandler}>
        <div className="card-modal-box">
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
              className="title"
              onClick={(e: React.MouseEvent): void => {
                setEditCardTitle(true);
                e.stopPropagation();
              }}
            >
              {currentCard.title}
            </h1>
          )}
          <span className="card-modal-list-name">
            In a column: <span>{currentList.title}</span>
          </span>
          <div className="card-modal-members">
            <h4 className="card-modal-users-title">Users:</h4>
            <div className="card-modal-users-container">
              <div className="card-modal-users-icon" />
              <div className="card-modal-users-icon" />
              <div className="card-modal-users-icon" />
              <button className="card-modal-users-icon invite">+</button>
              <button className="card-modal-btn-join-member">Join</button>
            </div>
          </div>
          <div className="card-modal-description">
            <div className="card-modal-description-header-container">
              <h4 className="card-modal-description-header">Description</h4>
              <button
                className="card-modal-description-btn-edit"
                onClick={(e: React.MouseEvent): void => {
                  setEditDescription(!isEditCardDescription);
                  e.stopPropagation();
                }}
              >
                Edit
              </button>
            </div>
            {isEditCardDescription ? (
              <textarea
                className="card-modal-description-edit"
                value={valueOfDescription}
                onChange={changeDescriptionValue}
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
              <span className="card-modal-description-text">
                {currentCard.description && <LinkComponent text={currentCard.description} />}
              </span>
            )}
          </div>
        </div>
        <div className="card-modal-actions-container">
          <h4 className="card-modal-actions-header">Actions</h4>
          <button
            className={
              isVisibleCopyMoveModal && !isCopyCard ? 'card-modal-actions-btn disabled' : 'card-modal-actions-btn'
            }
            onClick={(): void => {
              setCopyCard(true);
              setVisibleCopyMoveModal(!isVisibleCopyMoveModal);
            }}
            disabled={isVisibleCopyMoveModal && !isCopyCard}
          >
            Copy
          </button>
          <button
            className={
              isVisibleCopyMoveModal && isCopyCard ? 'card-modal-actions-btn disabled' : 'card-modal-actions-btn'
            }
            onClick={(): void => {
              setCopyCard(false);
              setVisibleCopyMoveModal(!isVisibleCopyMoveModal);
            }}
            disabled={isVisibleCopyMoveModal && isCopyCard}
          >
            Move
          </button>
          <button
            className={isVisibleCopyMoveModal ? 'card-modal-actions-btn disabled' : 'card-modal-actions-btn archive'}
            onClick={(): void => {
              cardBtnArchiveHandler();
              onCardModalClose();
            }}
            disabled={isVisibleCopyMoveModal}
          >
            Archive
          </button>
        </div>
        <button className="card-modal-btn-close" onClick={(): void => onCardModalClose()}>
          +
        </button>
      </div>
      {isVisibleCopyMoveModal ? <CardCopyMoveModal isCopy={isCopyCard} /> : ''}
      <div className="gray-background-box" onClick={(): void => onCardModalClose()} />
    </div>
  );
}
