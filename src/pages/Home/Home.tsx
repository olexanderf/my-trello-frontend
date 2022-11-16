import { connect } from 'react-redux';
import React, { ReactElement } from 'react';
import Board from '../../common/interfaces/Board';
import IconBoard from './components/Board/IconBoard';
import './home.scss';
import { createBoard, deleteBoard, getBoards } from '../../store/modules/boards/actions';
import { AppState } from '../../store/store';
import Modal from '../Multipurpose/Modal/Modal';
import { boardInputRegex } from '../../common/constants/regExp';
import ProgressBar from '../Multipurpose/ProgressBar/ProgressBar';

type PropsType = {
  boards: Board[];
  getBoards: () => Promise<void>;
  createBoard: (title: string) => Promise<void>;
  deleteBoard: (id: number) => Promise<void>;
};
type StateType = {
  boards: Board[];
  isVisibleModal: boolean;
  modalValue: string;
};

class Home extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { boards } = this.props;
    this.state = {
      boards,
      isVisibleModal: false,
      modalValue: '',
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleValueModal = this.handleValueModal.bind(this);
    this.handleClickCreateElement = this.handleClickCreateElement.bind(this);
  }

  componentDidMount(): void {
    const { getBoards: getBoardsAction } = this.props;
    getBoardsAction();
  }

  componentDidUpdate(): void {
    const { boards: boardsProps } = this.props;
    const { boards } = this.state;
    if (boards !== boardsProps) {
      this.setState({
        boards: boardsProps,
      });
    }
  }

  handleValueModal = (title: string): void => {
    this.setState({ modalValue: title });
  };

  toggleModal = (): void => {
    const { isVisibleModal } = this.state;
    this.setState({ isVisibleModal: !isVisibleModal });
  };

  handleClickCreateElement = (): void => {
    const { modalValue } = this.state;
    const { createBoard: createBoardAction } = this.props;
    if (modalValue.match(boardInputRegex)) {
      createBoardAction(modalValue);
      this.setState({ modalValue: '' });
    }
  };

  handleClickDeleteBoard = (id: number): void => {
    const { deleteBoard: deleteBoardAction } = this.props;
    deleteBoardAction(id);
  };

  render(): ReactElement {
    const { isVisibleModal, boards } = this.state;
    return (
      <div
        className="container"
        onClick={(): void => {
          if (isVisibleModal) this.toggleModal();
        }}
      >
        <h3 className="table-name">Мои Доски</h3>
        <div className="table-board">
          {boards.map((el) => {
            return <IconBoard key={el.id} board={el} handleClickDeleteBoard={this.handleClickDeleteBoard} />;
          })}
        </div>
        <Modal
          isVisibleModal={isVisibleModal}
          toggleModal={this.toggleModal}
          handleValueModal={this.handleValueModal}
          handleClickCreateElement={this.handleClickCreateElement}
        />
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
        <ProgressBar completed={50} />
      </div>
    );
  }
}

const mapStateToProps = (store: AppState): StateType => ({
  boards: store.boards,
});

export default connect(mapStateToProps, { getBoards, createBoard, deleteBoard })(Home);
