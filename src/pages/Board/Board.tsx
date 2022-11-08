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
import { editNameBoard, getBoard, createList } from '../../store/modules/board/actions';
import OneBoard from '../../common/interfaces/OneBoard';
import { boardInputRegex } from '../../common/constants/regExp';
import Modal from '../Home/components/Modal/Modal';

interface PropsType {
  board: OneBoard;
  getBoard: (id: number) => Promise<void>;
  editNameBoard: (id: number, boardName: string) => Promise<void>;
  createList: (id: number, listName: string, position: number) => Promise<void>;
}

interface StateType {
  title: string;
  lists: Lists[];
  editHeader: boolean;
  newValueTitle: string;
  isVisibleModal: boolean;
  modalValue: string;
}

type Params = {
  board_id: string;
};

class Board extends React.Component<PropsType & RouteComponentProps<Params>, StateType> {
  constructor(props: PropsType & RouteComponentProps<Params>) {
    super(props);
    this.state = {
      title: this.props.board.title,
      lists: this.props.board.lists,
      editHeader: false,
      newValueTitle: this.props.board.title,
      isVisibleModal: false,
      modalValue: '',
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleValueModal = this.handleValueModal.bind(this);
    this.handleClickCreateElement = this.handleClickCreateElement.bind(this);
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
      this.setState({
        title: this.props.board.title,
        newValueTitle: this.props.board.title,
      });
    }
    if (this.props.board.lists !== this.state.lists) {
      this.setState({
        lists: this.props.board.lists,
      });
    }
  }
  changeTitleName = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newValueTitle: e.target.value });
  };
  titleBoardEnterPressed = (e: KeyboardEvent) => {
    if (e.key === 'Enter') this.updateTitleName();
  };
  updateTitleName = () => {
    const { newValueTitle, editHeader } = this.state;
    const { board_id } = this.props.router.params;
    if (newValueTitle.match(boardInputRegex) && board_id !== undefined) {
      this.props.editNameBoard(Number(board_id), newValueTitle);
      this.setState({ editHeader: !editHeader });
    }
  };
  // Create Lists
  toggleModal = (): void => {
    const { isVisibleModal } = this.state;
    this.setState({ isVisibleModal: !isVisibleModal });
  };
  handleValueModal = (title: string): void => {
    this.setState({ modalValue: title });
  };
  handleClickCreateElement = (): void => {
    let { modalValue, lists } = this.state;
    const { createList } = this.props;
    const { board_id: boardId } = this.props.router.params;
    if (modalValue.match(boardInputRegex) && boardId !== undefined) {
      createList(+boardId, modalValue, lists.length+1);
      this.setState({ modalValue: '' });
    }
  };

  render(): ReactElement {
    const { lists, editHeader, title, newValueTitle, isVisibleModal } = this.state;
    return (
      <div
        className="board-container"
        onClick={(e): void => {
          if (isVisibleModal) this.toggleModal();
        }}
      >
        <div
          className="board-title"
          onClick={(): void => {
            if (!editHeader) this.setState({ editHeader: !editHeader });
          }}
        >
          {editHeader ? (
            <input
              type="text"
              value={newValueTitle}
              onChange={this.changeTitleName}
              onBlur={this.updateTitleName}
              onKeyDown={this.titleBoardEnterPressed}
              className="header-input"
            />
          ) : (
            <h1>{title}</h1>
          )}
        </div>
        <div className="block-table">
          <div className="block-lists">
            {this.state.lists
              ? lists.map((el) => {
                  return <List key={el.id} list={el} />;
                })
              : ''}
          </div>
          <div className="btn-container">
            <button
              className="add-list"
              onClick={(): void => {
                return this.toggleModal();
              }}
            >
              +
            </button>
          </div>
          <Modal
            isVisibleModal={isVisibleModal}
            toggleModal={this.toggleModal}
            handleValueModal={this.handleValueModal}
            handleClickCreateElement={this.handleClickCreateElement}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: AppState): StateType => ({
  board: store.board,
});

export default compose(withRouter, connect(mapStateToProps, { getBoard, editNameBoard, createList }))(Board);
