/* eslint-disable @typescript-eslint/indent */
import React, { ChangeEvent, ReactElement } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Lists from '../../common/interfaces/Lists';
import List from './components/List/List';
import './board.scss';
import withRouter from '../../common/tools/wR';
import { AppState } from '../../store/store';
import { editNameBoard, getBoard, createList } from '../../store/modules/board/actions';
import OneBoard from '../../common/interfaces/OneBoard';
import { boardInputRegex } from '../../common/constants/regExp';
import Modal from '../Multipurpose/Modal/Modal';
import ProgressBar from '../Multipurpose/ProgressBar/ProgressBar';

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
    const { board } = this.props;
    this.state = {
      title: board.title,
      lists: board.lists,
      editHeader: false,
      newValueTitle: board.title,
      isVisibleModal: false,
      modalValue: '',
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleValueModal = this.handleValueModal.bind(this);
    this.handleClickCreateElement = this.handleClickCreateElement.bind(this);
  }

  componentDidMount(): void {
    const { router, getBoard: getBoardAction } = this.props;
    const { board_id: boardId } = router.params;
    if (boardId !== undefined) {
      getBoardAction(+boardId);
    }
  }

  componentDidUpdate(): void {
    const { board } = this.props;
    const { title, lists } = this.state;
    if (board.title !== title) {
      this.setState({
        title: board.title,
        newValueTitle: board.title,
      });
    }
    if (board.lists !== lists) {
      this.setState({
        lists: board.lists,
      });
    }
  }

  changeTitleName = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ newValueTitle: e.target.value });
  };

  titleBoardEnterPressed = (e: React.KeyboardEvent): void => {
    const { board } = this.props;
    if (e.key === 'Enter') this.updateTitleName();
    if (e.key === 'Escape') this.setState({ newValueTitle: board.title });
  };

  updateTitleName = (): void => {
    const { newValueTitle, editHeader } = this.state;
    const { router, editNameBoard: editNameBoardAction } = this.props;
    const { board_id: boardId } = router.params;
    if (newValueTitle.match(boardInputRegex) && boardId !== undefined) {
      editNameBoardAction(Number(boardId), newValueTitle);
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
    const { modalValue, lists } = this.state;
    const { createList: createListAction, router } = this.props;
    const { board_id: boardId } = router.params;
    if (modalValue.match(boardInputRegex) && boardId !== undefined) {
      createListAction(+boardId, modalValue, lists.length + 1);
      this.setState({ modalValue: '' });
    }
  };

  render(): ReactElement {
    const { lists, editHeader, title, newValueTitle, isVisibleModal } = this.state;
    return (
      <div
        className="board-container"
        onClick={(): void => {
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
            {lists
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
        <ProgressBar completed={50} />
      </div>
    );
  }
}

const mapStateToProps = (store: AppState): StateType => ({
  board: store.board,
});

export default compose(withRouter, connect(mapStateToProps, { getBoard, editNameBoard, createList }))(Board);
