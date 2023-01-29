/* eslint-disable @typescript-eslint/indent */
import React, { ChangeEvent, ReactElement } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Outlet } from 'react-router-dom';
import Lists from '../../common/interfaces/Lists';
import List from './components/List/List';
import './board.scss';
import withRouter from '../../common/tools/wR';
import { AppState } from '../../store/store';
import { editNameBoard, getBoard, createList } from '../../store/modules/board/actions';
import SingleBoard from '../../common/interfaces/OneBoard';
import { boardInputRegex } from '../../common/constants/regExp';
import Modal from '../Multipurpose/Modal/Modal';
import CardEditModal from '../../common/interfaces/CardEditModal';

interface PropsType {
  board: SingleBoard;
  getBoard: (id: number) => Promise<void>;
  editNameBoard: (id: number, boardName: string) => Promise<void>;
  createList: (id: number, listName: string, position: number) => Promise<void>;
  cardEditModal: CardEditModal;
}

interface StateType {
  title: string;
  lists: Lists[];
  editHeader: boolean;
  newValueTitle: string;
  isVisibleModal: boolean;
  modalValue: string;
  isVisibleCardEditModal: boolean;
}

type Params = {
  board_id: string;
};

class Board extends React.Component<PropsType & RouteComponentProps<Params>, StateType> {
  constructor(props: PropsType & RouteComponentProps<Params>) {
    super(props);
    const { board, cardEditModal } = this.props;
    this.state = {
      title: board.title,
      lists: board.lists,
      editHeader: false,
      newValueTitle: board.title,
      isVisibleModal: false,
      modalValue: '',
      isVisibleCardEditModal: cardEditModal.isVisibleCardModalEdit,
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
    const { board, cardEditModal } = this.props;
    const { isVisibleCardModalEdit } = cardEditModal;
    const { title, lists, isVisibleCardEditModal } = this.state;
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
    if (isVisibleCardEditModal !== isVisibleCardModalEdit) {
      this.setState({
        isVisibleCardEditModal: isVisibleCardModalEdit,
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
    const { lists, editHeader, title, newValueTitle, isVisibleModal, isVisibleCardEditModal } = this.state;
    return (
      <div className="board-container">
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
              ? lists.map((list) => {
                  return <List key={list.id} list={list} />;
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
          {isVisibleModal ? (
            <Modal
              toggleModal={this.toggleModal}
              handleValueModal={this.handleValueModal}
              handleClickCreateElement={this.handleClickCreateElement}
            />
          ) : (
            ''
          )}
          {isVisibleCardEditModal ? <Outlet /> : ''}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: AppState): object => ({
  board: store.board,
  cardEditModal: store.cardEditModal,
});

export default compose(withRouter, connect(mapStateToProps, { getBoard, editNameBoard, createList }))(Board);
