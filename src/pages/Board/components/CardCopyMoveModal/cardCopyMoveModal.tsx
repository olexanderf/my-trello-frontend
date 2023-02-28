import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ICard from '../../../../common/interfaces/ICard';
import UpdatedCards from '../../../../common/interfaces/UpdatedCards';
import { createCard, moveCards } from '../../../../store/modules/board/actions';
import { deleteCardAction, fetchBoardDate as fetchBoardData } from '../../../../store/modules/cardEditModal/action';
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
  const boardOnScreen = useSelector((state: AppState) => state.board);
  const selectedBoard = useSelector((state: AppState) => state.cardEditModal.boardOnModal);
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
  const createCopyCard = (
    targetBoardId: number,
    targetListId: number,
    position: number,
    noFetchBoard?: boolean
  ): void => {
    dispatch(
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
    if (selectedBoard.lists[options.indexOfSelectedList].cards.length === 0) {
      createCopyCard(
        boards[options.indexOfBoard].id,
        selectedBoard.lists[options.indexOfSelectedList].id,
        newCardPosition
      );
      navigate(`/board/${boards[options.indexOfBoard].id}`);
    } else {
      const cardsArr = selectedBoard.lists[options.indexOfSelectedList].cards.map((c, index) => {
        if (c.position >= newCardPosition) return { ...c, position: c.position + 1 };
        return { ...c, position: index + 1 };
      });
      const newList = { ...selectedBoard.lists[options.indexOfSelectedList], cards: cardsArr };
      const updatedListsArr = [...selectedBoard.lists];
      updatedListsArr.splice(options.indexOfSelectedList, 1, newList);
      const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
        return { id: c.id, position: c.position, list_id: selectedBoard.lists[options.indexOfSelectedList].id };
      });

      await dispatch(moveCards(boards[options.indexOfBoard].id, arrUpdatedCards, updatedListsArr));
      await createCopyCard(
        boards[options.indexOfBoard].id,
        selectedBoard.lists[options.indexOfSelectedList].id,
        newCardPosition
      );
      await navigate(`/board/${boards[options.indexOfBoard].id}`);
    }
  };

  const replaceCard = async (newCardPosition: number): Promise<void> => {
    // create copy card
    const newCard: ICard = { ...cardOnModal };
    // create copy of cards arr on list and delete current card
    let cardsArr = [...listOnModal.cards];
    cardsArr.splice(cardOnModal.position - 1, 1);
    // check if selected board same that we choose on modal
    if (boardId && +boardId === +boards[options.indexOfBoard].id) {
      // check if selected list same that we choose on modal
      if (listOnModal.id === selectedBoard.lists[options.indexOfSelectedList].id) {
        cardsArr.splice(newCardPosition - 1, 0, newCard);
        cardsArr = cardsArr.map((c, index) => {
          return { ...c, position: index + 1 };
        });
        const newList = { ...selectedBoard.lists[options.indexOfSelectedList], cards: cardsArr };
        const updatedListsArr = [...selectedBoard.lists];
        updatedListsArr.splice(options.indexOfSelectedList, 1, newList);
        const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
          return { id: c.id, position: c.position, list_id: selectedBoard.lists[options.indexOfSelectedList].id };
        });
        await dispatch(moveCards(boards[options.indexOfBoard].id, arrUpdatedCards, updatedListsArr));
        await navigate(`/board/${boards[options.indexOfBoard].id}`);
      }
      if (listOnModal.position !== options.indexOfSelectedList + 1) {
        if (newCard.position !== cardsArr.length) {
          cardsArr = cardsArr.map((c, index) => {
            return { ...c, position: index + 1 };
          });
        }

        let targetArrOfCards = [...selectedBoard.lists[options.indexOfSelectedList].cards];
        targetArrOfCards.splice(newCardPosition - 1, 0, newCard);
        targetArrOfCards = targetArrOfCards.map((c, index) => {
          return { ...c, position: index + 1 };
        });

        const newList = { ...boardOnScreen.lists[listOnModal.position - 1], cards: cardsArr };
        const newTargetList = { ...selectedBoard.lists[options.indexOfSelectedList], cards: targetArrOfCards };
        const updatedListsArr = [...boardOnScreen.lists];
        updatedListsArr.splice(listOnModal.position - 1, 1, newList);
        updatedListsArr.splice(options.indexOfSelectedList, 1, newTargetList);

        // update state and send request
        const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
          return { id: c.id, position: c.position, list_id: boardOnScreen.lists[listOnModal.position - 1].id };
        });
        const targetArrUpdatedCards: UpdatedCards[] = targetArrOfCards.map((c) => {
          return { id: c.id, position: c.position, list_id: selectedBoard.lists[options.indexOfSelectedList].id };
        });
        arrUpdatedCards.splice(arrUpdatedCards.length, 0, ...targetArrUpdatedCards);
        await dispatch(moveCards(+boardId, arrUpdatedCards, updatedListsArr));
        await navigate(`/board/${boardId}`);
      }
    } else {
      await createCopyCard(
        boards[options.indexOfBoard].id,
        selectedBoard.lists[options.indexOfSelectedList].id,
        newCardPosition,
        true
      );
      // const crd: ICard = {
      //   id: boards[options.indexOfBoard].id,
      //   list_id: selectedBoard.lists[options.indexOfSelectedList].id,
      //   position: newCardPosition,
      //   title: cardOnModal.title,
      //   description: cardOnModal.description,
      //   custom: cardOnModal.custom,
      // };
      // replace card position where delete card
      // let arr1 = {};
      if (cardsArr.length > 0) {
        cardsArr = cardsArr.map((c, index) => {
          return { ...c, position: index + 1 };
        });

        const newList = { ...boardOnScreen.lists[listOnModal.position - 1], cards: cardsArr };
        const startListsArr = [...boardOnScreen.lists];
        startListsArr.splice(listOnModal.position - 1, 1, newList);

        const arrUpdatedCards: UpdatedCards[] = cardsArr.map((c) => {
          return { id: c.id, position: c.position, list_id: boardOnScreen.lists[listOnModal.position - 1].id };
        });
        if (boardId) await dispatch(moveCards(+boardId, arrUpdatedCards, startListsArr, true));
        // arr1 = { boardId: +boardId, arrUpdatedCards: arrUpdatedCards, startListsArr: startListsArr };
      }
      if (boardId) await dispatch(deleteCardAction(+boardId, cardOnModal.id));
      // const delcrd = { boardId: +boardId, cardOnModalId: cardOnModal.id };
      // replace target cards arr positions
      // let arr2 = {};
      if (selectedBoard.lists[options.indexOfSelectedList].cards.length !== 0) {
        let targetArrOfCards = [...selectedBoard.lists[options.indexOfSelectedList].cards];
        targetArrOfCards = targetArrOfCards.map((c, index) => {
          if (c.position >= newCardPosition) return { ...c, position: c.position + 1 };
          return { ...c, position: index + 1 };
        });
        const newTargetList = { ...selectedBoard.lists[options.indexOfSelectedList], cards: targetArrOfCards };
        const updatedListsArr = [...selectedBoard.lists];
        updatedListsArr.splice(options.indexOfSelectedList, 1, newTargetList);
        const targetArrUpdatedCards: UpdatedCards[] = targetArrOfCards.map((c) => {
          return { id: c.id, position: c.position, list_id: selectedBoard.lists[options.indexOfSelectedList].id };
        });
        await dispatch(moveCards(+boards[options.indexOfBoard].id, targetArrUpdatedCards, updatedListsArr));
        //   arr2 = {
        //     boardId: boards[options.indexOfBoard].id,
        //     targetArrUpdatedCards: targetArrUpdatedCards,
        //     updatedListsArr: updatedListsArr,
        //   };
      }
      // replaceCardAction(crd, arr1, delcrd, arr2);
      await navigate(`/board/${boards[options.indexOfBoard].id}`);
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
          {selectedBoard.lists &&
            selectedBoard.lists.map((l, index) => {
              return (
                <option key={l.id} value={index}>
                  {l.title}
                </option>
              );
            })}
        </select>
        <label htmlFor="position-select">Позиция:</label>
        <select name="position-select" id="position-select" form="copy-move-card" ref={selectCardPosition}>
          {selectedBoard.lists[options.indexOfSelectedList] ? (
            selectedBoard.lists[options.indexOfSelectedList].cards.map((c) => {
              return (
                <option key={c.id} value={c.position}>
                  {c.position}
                </option>
              );
            })
          ) : (
            <option value={1}>{1}</option>
          )}
          {selectedBoard.lists[options.indexOfSelectedList] &&
            selectedBoard.lists[options.indexOfSelectedList].id !== listOnModal.id && (
              <option value={selectedBoard.lists[options.indexOfSelectedList].cards.length + 1}>
                {selectedBoard.lists[options.indexOfSelectedList].cards.length + 1}
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
