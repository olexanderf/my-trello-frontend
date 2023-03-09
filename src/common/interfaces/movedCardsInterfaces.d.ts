import Lists from './Lists';

export interface DeleteCardData {
  boardId: number;
  cardId: number;
}
export interface UpdatedCardsPosition {
  boardId: number;
  cards: UpdatedCards[];
  lists: Lists[];
}
