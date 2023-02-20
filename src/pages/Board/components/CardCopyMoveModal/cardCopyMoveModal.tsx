import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import UpdatedCards from '../../../../common/interfaces/UpdatedCards';
import { createCard, moveCards } from '../../../../store/modules/board/actions';
import { fetchBoardDate as fetchBoardData } from '../../../../store/modules/cardEditModal/action';
import { AppDispatch, AppState } from '../../../../store/store';
import './cardCopyMoveModal.scss';

interface PropsType {
  isCopy: boolean;
}

export default function CardCopyMoveModal(props: PropsType): JSX.Element {
  const { isCopy } = props;
  const { board_id: boardId } = useParams();
  const navigate = useNavigate();
  const boards = useSelector((state: AppState) => state.boards);
  const currentBoard = useSelector((state: AppState) => state.cardEditModal.boardOnModal);
  const currentList = useSelector((state: AppState) => state.cardEditModal.listOnModal);
  const currentCard = useSelector((state: AppState) => state.cardEditModal.cardOnModal);
  const dispatch: AppDispatch = useDispatch();
  const [options, setOptions] = useState({
    indexOfBoard: 0,
    indexOfSelectedList: currentList.position - 1,
  });
  const selectValue = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (boardId !== undefined) setOptions({ ...options, indexOfBoard: boards.findIndex((b) => b.id === +boardId) });
  }, []);

  const boardValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setOptions({ ...options, indexOfBoard: +e.target.value });
    dispatch(fetchBoardData(boards[+e.target.value].id));
  };

  const listValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setOptions({ ...options, indexOfSelectedList: +e.target.value });
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
  const copyCard = async (newCardPosition: number): Promise<void> => {
    if (currentBoard.lists[options.indexOfSelectedList].cards.length === 0) {
      createCopyCard(
        boards[options.indexOfBoard].id,
        currentBoard.lists[options.indexOfSelectedList].id,
        newCardPosition
      );
      navigate(`/board/${boards[options.indexOfBoard].id}`);
    } else {
      const cardsArr = currentBoard.lists[options.indexOfSelectedList].cards.map((c, index) => {
        if (c.position >= newCardPosition) return { ...c, position: c.position + 1 };
        return { ...c, position: index + 1 };
      });
      const newList = { ...currentBoard.lists[options.indexOfSelectedList], cards: cardsArr };
      const updatedListsArr = [...currentBoard.lists];
      updatedListsArr.splice(options.indexOfSelectedList, 1, newList);
      const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
        return { id: c.id, position: c.position, list_id: currentBoard.lists[options.indexOfSelectedList].id };
      });

      await dispatch(moveCards(boards[options.indexOfBoard].id, arrUpdatedCards, updatedListsArr));
      await createCopyCard(
        boards[options.indexOfBoard].id,
        currentBoard.lists[options.indexOfSelectedList].id,
        newCardPosition
      );
      await navigate(`/board/${boards[options.indexOfBoard].id}`);
    }
  };
  const replaceCard = (newCardPosition: number): void => {
    // check if selected board same that we choose on modal
    if (boardId && +boardId === boards[options.indexOfBoard].id) {
      // check if selected list same that we choose on modal
      if (currentList.id === currentBoard.lists[options.indexOfSelectedList].id) {
        const cardsArr = currentBoard.lists[options.indexOfSelectedList].cards.map((c, index) => {
          if (c.id === currentCard.id) return { ...c, position: newCardPosition };
          if (c.position >= newCardPosition && c.id !== currentCard.id) return { ...c, position: c.position + 1 };
          return { ...c, position: index + 1 };
        });
        const newList = { ...currentBoard.lists[options.indexOfSelectedList], cards: cardsArr };
        const updatedListsArr = [...currentBoard.lists];
        updatedListsArr.splice(options.indexOfSelectedList, 1, newList);
        const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
          return { id: c.id, position: c.position, list_id: currentBoard.lists[options.indexOfSelectedList].id };
        });
        dispatch(moveCards(boards[options.indexOfBoard].id, arrUpdatedCards, updatedListsArr));
      }
    }
    // if (currentList.position !== options.indexOfSelectedList + 1) {
    // }
  };
  const onSubmitForm = (): void => {
    const newCardPosition = Number(selectValue.current?.value);
    if (
      (boardId && +boardId !== boards[options.indexOfBoard].id) ||
      currentList.position !== options.indexOfSelectedList + 1 ||
      currentCard.position !== newCardPosition
    ) {
      if (isCopy) {
        copyCard(newCardPosition);
      } else replaceCard(newCardPosition);
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
        <select name="position-select" id="position-select" form="copy-move-card" ref={selectValue}>
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
          {currentBoard.lists[options.indexOfSelectedList] && isCopy && (
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
