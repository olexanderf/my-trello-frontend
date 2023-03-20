import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ICard, { MovedICard } from '../../../../common/interfaces/ICard';
import UpdatedCards from '../../../../common/interfaces/UpdatedCards';
import { createCard, getBoard, moveCards } from '../../../../store/modules/board/actions';
import { fetchBoardData, moveCardAnotherBoard } from '../../../../store/modules/cardEditModal/action';
import { AppDispatch, AppState } from '../../../../store/store';
import updateCardPositions from '../../../../common/tools/ModalCardMover';
import './cardCopyMoveModal.scss';
import { DeleteCardData, UpdatedCardsPosition } from '../../../../common/interfaces/movedCardsInterfaces';

interface PropsType {
  isCopy: boolean;
}

export default function CardCopyMoveModal(props: PropsType): JSX.Element {
  const { isCopy } = props;
  const { board_id: boardId } = useParams();
  const navigate = useNavigate();
  const boards = useSelector((state: AppState) => state.boards);
  const boardOnScreen = useSelector((state: AppState) => state.board);
  const board = useSelector((state: AppState) => state.cardEditModal.boardOnModal);
  const listOnModal = useSelector((state: AppState) => state.cardEditModal.listOnModal);
  const cardOnModal = useSelector((state: AppState) => state.cardEditModal.cardOnModal);
  const dispatch: AppDispatch = useDispatch();
  const [options, setOptions] = useState({
    indexOfBoard: boards.findIndex((b) => boardId && b.id === +boardId) || 0,
    indexOfSelectedList: listOnModal.position - 1,
  });
  const selectCardPosition = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (boardId !== undefined)
      setOptions({
        ...options,
        indexOfBoard: boards.findIndex((b) => b.id === +boardId),
      });
  }, []);

  useEffect(() => {
    if (boardId && +boardId !== +boards[options.indexOfBoard].id) setOptions({ ...options, indexOfSelectedList: 0 });
  }, [options.indexOfBoard]);

  const boardValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setOptions({ ...options, indexOfBoard: +e.target.value });
    dispatch(fetchBoardData(boards[+e.target.value].id));
  };

  const listValueHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setOptions({ ...options, indexOfSelectedList: +e.target.value });
  };
  const createCopyCard = async (
    targetBoardId: number,
    targetListId: number,
    position: number,
    noFetchBoard?: boolean
  ): Promise<void> => {
    await dispatch(
      createCard(
        targetBoardId,
        cardOnModal.title,
        targetListId,
        position,
        cardOnModal?.description,
        cardOnModal?.custom,
        noFetchBoard
      )
    );
  };
  const copyCard = async (newCardPosition: number): Promise<void> => {
    if (board.lists[options.indexOfSelectedList].cards.length === 0) {
      createCopyCard(boards[options.indexOfBoard].id, board.lists[options.indexOfSelectedList].id, newCardPosition);
      navigate(`/board/${boards[options.indexOfBoard].id}`);
    } else {
      const cardsArr = board.lists[options.indexOfSelectedList].cards.map((c, index) => {
        if (c.position >= newCardPosition) return { ...c, position: c.position + 1 };
        return { ...c, position: index + 1 };
      });
      const newList = { ...board.lists[options.indexOfSelectedList], cards: cardsArr };
      const updatedListsArr = [...board.lists];
      updatedListsArr.splice(options.indexOfSelectedList, 1, newList);
      const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
        return { id: c.id, position: c.position, list_id: board.lists[options.indexOfSelectedList].id };
      });

      await dispatch(moveCards(boards[options.indexOfBoard].id, arrUpdatedCards, updatedListsArr));
      await createCopyCard(
        boards[options.indexOfBoard].id,
        board.lists[options.indexOfSelectedList].id,
        newCardPosition
      );
      await navigate(`/board/${boards[options.indexOfBoard].id}`);
    }
  };

  const replaceCard = async (newCardPosition: number): Promise<void> => {
    // create copy card
    const newCard: ICard = { ...cardOnModal };
    // create copy of cards arr on list and delete current card
    const cardsArr = [...listOnModal.cards];
    cardsArr.splice(cardOnModal.position - 1, 1);
    // check if selected board same that we choose on modal
    if (boardId && +boardId === +boards[options.indexOfBoard].id) {
      // check if selected list same that we choose on modal
      if (listOnModal.id === board.lists[options.indexOfSelectedList].id) {
        const { arrUpdatedCards, updatedListsArr } = updateCardPositions(
          cardsArr,
          board,
          options.indexOfSelectedList,
          newCardPosition,
          newCard
        );
        await dispatch(moveCards(boards[options.indexOfBoard].id, arrUpdatedCards, updatedListsArr));
        await navigate(`/board/${boards[options.indexOfBoard].id}`);
      }
      if (listOnModal.position !== options.indexOfSelectedList + 1) {
        const { arrUpdatedCards, updatedListsArr } = updateCardPositions(
          [...board.lists[options.indexOfSelectedList].cards],
          board,
          options.indexOfSelectedList,
          newCardPosition,
          newCard
        );
        if (newCard.position < cardsArr.length + 1) {
          const { arrUpdatedCards: moveStartUpdatedCards, updatedListsArr: moveStartUpdatedListArr } =
            updateCardPositions(cardsArr, boardOnScreen, listOnModal.position - 1);
          const changedList = moveStartUpdatedListArr[listOnModal.position - 1];
          updatedListsArr.splice(listOnModal.position - 1, 1, changedList);
          arrUpdatedCards.splice(arrUpdatedCards.length, 0, ...moveStartUpdatedCards);
        }
        await dispatch(moveCards(+boardId, arrUpdatedCards, updatedListsArr));
        await navigate(`/board/${boardId}`);
      }
    } else {
      let startMove = {};
      if (cardOnModal.position < cardsArr.length + 1) {
        const { arrUpdatedCards, updatedListsArr: startListsArr } = updateCardPositions(
          cardsArr,
          boardOnScreen,
          listOnModal.position - 1
        );
        if (boardId) startMove = { boardId: +boardId, cards: arrUpdatedCards, lists: startListsArr };
      }
      let targetMove = {};
      if (board.lists[options.indexOfSelectedList].cards.length !== 0) {
        const { arrUpdatedCards: targetArrUpdatedCards, updatedListsArr } = updateCardPositions(
          [...board.lists[options.indexOfSelectedList].cards],
          board,
          options.indexOfSelectedList,
          newCardPosition
        );
        targetMove = {
          boardId: +boards[options.indexOfBoard].id,
          cards: targetArrUpdatedCards,
          lists: updatedListsArr,
        };
      }
      const cardToNewBoard: MovedICard = {
        board_id: boards[options.indexOfBoard].id,
        title: cardOnModal.title,
        list_id: board.lists[options.indexOfSelectedList].id,
        position: newCardPosition,
        description: cardOnModal.description,
        custom: cardOnModal.custom,
      };
      if (boardId) {
        const deleteCardData: DeleteCardData = {
          boardId: +boardId,
          cardId: cardOnModal.id,
        };
        await dispatch(
          moveCardAnotherBoard(
            cardToNewBoard,
            deleteCardData,
            startMove as UpdatedCardsPosition,
            targetMove as UpdatedCardsPosition
          )
        );
      }
      dispatch(getBoard(+boards[options.indexOfBoard].id));
      await navigate(`/board/${+boards[options.indexOfBoard].id}`);
    }
  };

  const onSubmitForm = (): void => {
    const newCardPosition = Number(selectCardPosition.current?.value);
    if (
      (boardId && +boardId !== boards[options.indexOfBoard].id) ||
      listOnModal.position !== options.indexOfSelectedList + 1 ||
      cardOnModal.position !== newCardPosition
    ) {
      if (isCopy) {
        copyCard(newCardPosition);
      } else replaceCard(newCardPosition);
    }
  };

  return (
    <div className="card-copy-move-modal-container">
      <h3 className="title-card-copy-move">{isCopy ? 'Копировать' : 'Переместить'}</h3>
      <form
        className="form-card-copy-move"
        action=""
        id="copy-move-card"
        onSubmit={(e): void => {
          onSubmitForm();
          e.preventDefault();
        }}
      >
        <label htmlFor="board-select">Доска:</label>
        <select
          className="board-select"
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
          className="list-select"
          name="list-select"
          id="list-select"
          form="copy-move-card"
          value={options.indexOfSelectedList}
          onChange={(e): void => listValueHandler(e)}
        >
          {board.lists &&
            board.lists.map((l, index) => {
              return (
                <option key={l.id} value={index}>
                  {l.title}
                </option>
              );
            })}
        </select>
        <label htmlFor="position-select">Позиция:</label>
        <select
          className="position-select"
          name="position-select"
          id="position-select"
          form="copy-move-card"
          ref={selectCardPosition}
        >
          {board.lists[options.indexOfSelectedList] ? (
            board.lists[options.indexOfSelectedList].cards.map((c) => {
              return (
                <option key={c.id} value={c.position}>
                  {c.position}
                </option>
              );
            })
          ) : (
            <option value={1}>{1}</option>
          )}
          {board.lists[options.indexOfSelectedList] &&
            board.lists[options.indexOfSelectedList].id !== listOnModal.id && (
              <option value={board.lists[options.indexOfSelectedList].cards.length + 1}>
                {board.lists[options.indexOfSelectedList].cards.length + 1}
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
