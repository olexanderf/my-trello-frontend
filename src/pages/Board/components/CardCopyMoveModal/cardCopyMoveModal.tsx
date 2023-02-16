import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UpdatedCards from '../../../../common/interfaces/UpdatedCards';
import { createCard, moveCards } from '../../../../store/modules/board/actions';
import { fetchBoardDate as fetchBoardData, toggleCardEditModal } from '../../../../store/modules/cardEditModal/action';
import { AppDispatch, AppState } from '../../../../store/store';
import './cardCopyMoveModal.scss';

interface PropsType {
  isCopy: boolean;
}

export default function CardCopyMoveModal(props: PropsType): JSX.Element {
  const { isCopy } = props;
  const { board_id: boardId } = useParams();
  const boards = useSelector((state: AppState) => state.boards);
  const currentBoard = useSelector((state: AppState) => state.cardEditModal.boardOnModal);
  const currentList = useSelector((state: AppState) => state.cardEditModal.listOnModal);
  const currentCard = useSelector((state: AppState) => state.cardEditModal.cardOnModal);
  const dispatch: AppDispatch = useDispatch();
  const [options, setOptions] = useState({
    indexOfBoard: 0,
    indexOfSelectedList: currentList.position - 1,
    selectedCardPosition: currentCard.position,
  });

  useEffect(() => {
    if (boardId !== undefined) setOptions({ ...options, indexOfBoard: boards.findIndex((b) => b.id === +boardId) });
  }, []);

  const boardValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setOptions({ ...options, indexOfBoard: +e.target.value });
    if (boardId) {
      dispatch(fetchBoardData(boards[+e.target.value].id));
    }
  };

  const listValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setOptions({ ...options, indexOfSelectedList: +e.target.value });
  };
  const cardPositionHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setOptions({ ...options, selectedCardPosition: +e.target.value });
  };
  const createCopyCard = (targetBoardId: number, targetListId: number, position: number): void => {
    dispatch(
      createCard(
        targetBoardId,
        currentCard.title,
        targetListId,
        position,
        currentCard?.description,
        currentCard?.custom
      )
    );
  };
  const copyCard = (): void => {
    if (currentBoard.lists[options.indexOfSelectedList].cards.length === 0) {
      createCopyCard(boards[options.indexOfBoard].id, currentBoard.lists[options.indexOfSelectedList].id, 1);
    } else {
      createCopyCard(
        boards[options.indexOfBoard].id,
        currentBoard.lists[options.indexOfSelectedList].id,
        options.selectedCardPosition
      );
      const cardsArr = currentBoard.lists[options.indexOfSelectedList].cards.map((c, index) => {
        if (c.position >= options.selectedCardPosition) return { ...c, position: c.position + 1 };
        return { ...c, position: index + 1 };
      });
      const newList = { ...currentBoard.lists[options.indexOfSelectedList], cards: cardsArr };
      const updatedListsArr = [...currentBoard.lists];
      updatedListsArr.splice(options.indexOfSelectedList, 1, newList);
      const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
        return { id: c.id, position: c.position, list_id: currentBoard.lists[options.indexOfSelectedList].id };
      });
      dispatch(moveCards(boards[options.indexOfBoard].id, arrUpdatedCards, updatedListsArr));
      dispatch(toggleCardEditModal(false));
    }
  };
  const replaceCard = (): void => {
    // if (currentList.position !== options.indexOfSelectedList + 1) {
    // }
  };
  const onSubmitForm = (): void => {
    if (
      currentList.position !== options.indexOfSelectedList + 1 ||
      currentCard.position !== options.selectedCardPosition
    ) {
      if (isCopy) {
        copyCard();
      }
      replaceCard();
    }
  };

  return (
    <div className="card-copy-move-modal-container">
      <h3 className="card-copy-move-modal-name">{isCopy ? 'Копировать' : 'Переместить'}</h3>
      <form
        action=""
        id="copy-move-card"
        onSubmit={(e): void => {
          onSubmitForm();
          e.preventDefault();
        }}
      >
        <label htmlFor="board-select">Доска:</label>
        <select
          name="board-select"
          id="board-select"
          form="copy-move-card"
          value={options.indexOfBoard}
          onChange={(e): void => boardValueHandler(e)}
        >
          {boards &&
            boards.map((b, index) => {
              return (
                <option key={b.id} value={index}>
                  {b.title}
                </option>
              );
            })}
        </select>
        <label htmlFor="list-select">Список:</label>
        <select
          name="list-select"
          id="list-select"
          form="copy-move-card"
          value={options.indexOfSelectedList}
          onChange={(e): void => listValueHandler(e)}
        >
          {currentBoard.lists &&
            currentBoard.lists.map((l, index) => {
              return (
                <option key={l.id} value={index}>
                  {l.title}
                </option>
              );
            })}
        </select>
        <label htmlFor="position-select">Позиция:</label>
        <select
          name="position-select"
          id="position-select"
          form="copy-move-card"
          value={options.selectedCardPosition}
          onChange={(e): void => cardPositionHandler(e)}
        >
          {currentBoard.lists[options.indexOfSelectedList] ? (
            currentBoard.lists[options.indexOfSelectedList].cards.map((c) => {
              return (
                <option key={c.id} value={c.position}>
                  {c.position}
                </option>
              );
            })
          ) : (
            <option value={1}>{1}</option>
          )}
          {currentBoard.lists[options.indexOfSelectedList] && (
            <option value={currentBoard.lists[options.indexOfSelectedList].cards.length + 1}>
              {currentBoard.lists[options.indexOfSelectedList].cards.length + 1}
            </option>
          )}
        </select>
        <br />
        <button className="card-copy-move-modal-btn" type="submit">
          {isCopy ? 'Копировать' : 'Переместить'}
        </button>
      </form>
    </div>
  );
}
