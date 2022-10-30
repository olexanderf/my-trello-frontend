/* eslint-disable react/no-unused-state */
/* eslint-disable react/prefer-stateless-function */
import React, { ChangeEvent, ReactElement } from 'react';
import Lists from '../../common/interfaces/Lists';
import List from './components/List/List';
import './board.scss';
import withRouter from '../../common/tools/wR';
import { AppState } from '../../store/store';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { editNameBoard, getBoard } from '../../store/modules/board/actions';
import OneBoard from '../../common/interfaces/OneBoard';
import { boardInputRegex } from '../../common/constants/regExp';

interface PropsType {
  board: OneBoard;
  getBoard: (id: number) => Promise<void>;
  editNameBoard: (id: string, boardName: string) => Promise<void>;
}

interface StateType {
  title: string;
  lists: Lists[];
  editHeader: boolean;
  newValueTitle: string;
}

type Params = {
  board_id: string;
};

class Board extends React.Component<PropsType & RouteComponentProps<Params>, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      title: this.props.board.title,
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
      editHeader: false,
      newValueTitle: '',
    };
  }
  componentDidMount(): void {
    const { board_id } = this.props.router.params;
    if (board_id !== undefined) {
      this.props.getBoard(+board_id);
    }
  }
  componentDidUpdate(
    prevProps: Readonly<PropsType & RouteComponentProps<Params>>,
    prevState: Readonly<StateType>,
    snapshot?: any
  ): void {
    if (this.props.board.title !== this.state.title) {
      this.setState({ title: this.props.board.title });
    }
  }
  changeTitleName = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newValueTitle: e.target.value });
  };
  enterPressed = (e: KeyboardEvent) => {
    if (e.key === 'Enter') this.updateTitleName();
  };
  updateTitleName = () => {
    const { newValueTitle, editHeader } = this.state;
    const { board_id } = this.props.router.params;
    if (newValueTitle.match(boardInputRegex) && board_id !== undefined) {
      editNameBoard(+board_id, newValueTitle);
      this.setState({ editHeader: !editHeader});
    }
  };
  render(): ReactElement {
    const { lists, editHeader, title } = this.state;
    return (
      <div className="board-container">
        <div
          className="board-title"
          onClick={(e): void => {
            if (!editHeader) this.setState({ editHeader: !editHeader });
          }}
        >
          {editHeader ? (
            <input
              type="text"
              value={title}
              onChange={this.changeTitleName}
              onBlur={this.updateTitleName}
              onKeyDown={this.enterPressed}
              className="header-input"
            />
          ) : (
            <h1>{title}</h1>
          )}
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

const mapStateToProps = (store: AppState): StateType => ({
  board: store.board,
});

export default compose(withRouter, connect(mapStateToProps, { getBoard, editNameBoard }))(Board);
