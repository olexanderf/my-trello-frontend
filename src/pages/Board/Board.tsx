/* eslint-disable react/no-unused-state */
/* eslint-disable react/prefer-stateless-function */
import React, { ReactElement } from 'react';
import Lists from '../../common/interfaces/Lists';
import List from './components/List/List';
import './board.scss';
import withRouter from '../../common/tools/wR';

interface TableState {
  title: string;
  lists: Lists[];
}

class Board extends React.Component<{}, TableState> {
  constructor(props: {} | TableState) {
    super(props);
    this.state = {
      title: 'Моя тестовая доска',
      lists: [
        {
          id: 1,
          title: 'Планы',
          cards: [
            { id: 1, title: 'помыть кота' },
            { id: 2, title: 'приготовить суп' },
            { id: 3, title: 'сходить в магазин' },
          ],
        },
        {
          id: 2,
          title: 'В процессе',
          cards: [{ id: 4, title: 'посмотреть сериал' }],
        },
        {
          id: 3,
          title: 'Сделано',
          cards: [
            { id: 5, title: 'сделать домашку' },
            { id: 6, title: 'погулять с собакой' },
          ],
        },
      ],
    };
  }

  render(): ReactElement {
    const { title } = this.state;
    const { lists } = this.state;
    return (
      <div className="board-container">
        <div className="board-title">
          <h1>{title}</h1>
        </div>
        <div className="block-table">
          <div className="block-lists">
            {lists.map((el) => {
              return List(el);
            })}
          </div>
          <div className="btn-container">
            <button className="add-list">+</button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Board);
