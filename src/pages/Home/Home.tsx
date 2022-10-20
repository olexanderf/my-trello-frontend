import { connect } from 'react-redux';
import React, { ReactElement } from 'react';
import Board from '../../common/interfaces/Board';
import IconBoard from './components/Board/Board';
import './home.scss';
import { createBoard, getBoards } from '../../store/modules/boards/actions';
import { AppState } from '../../store/store';
import Modal from './components/Modal/Modal';

type PropsType = {
  boards: Board[];
  getBoards: () => Promise<void>;
};
type StateType = {
  boards: Board[];
  isVisibleModal: boolean;
  modalValue: string;
};

class Home extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      boards: props.boards,
      isVisibleModal: false,
      modalValue: '',
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleValueModal = this.handleValueModal.bind(this);
    this.handleClickCreateBoard = this.handleClickCreateBoard.bind(this);
  }

  componentDidMount(): void {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.getBoards();
  }

  handleValueModal = (title: string): void => {
    this.setState({ modalValue: title });
  };

  toggleModal = (): void => {
    const { isVisibleModal } = this.state;
    this.setState({ isVisibleModal: !isVisibleModal });
  };

  handleClickCreateBoard = (): void => {
    const { modalValue } = this.state;
    if (modalValue !== '') createBoard(modalValue);
  };

  render(): ReactElement {
    const { boards } = this.props;
    const { isVisibleModal } = this.state;
    // const { modalValue } = this.state;
    return (
      <div
        className="container"
        // onClick={(): void => {
        //   if (isVisibleModal) this.toggleModal();
        // }}
      >
        <h3 className="table-name">Мои Доски</h3>
        <div className="table-board">
          {boards.map((el) => {
            return IconBoard(el);
          })}
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
          handleClickCreateBoard={this.handleClickCreateBoard}
        />
      </div>
    );
  }
}

const mapStateToProps = (store: AppState): StateType => ({
  boards: store.boards,
});

export default connect(mapStateToProps, { getBoards })(Home);
