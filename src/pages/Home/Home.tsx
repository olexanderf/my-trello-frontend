import { connect } from 'react-redux';
import React, { ReactElement } from 'react';
import Board from '../../common/interfaces/Board';
import IconBoard from './components/Board/IconBoard';
import './home.scss';
import { createBoard, deleteBoard, getBoards } from '../../store/modules/boards/actions';
import { AppState } from '../../store/store';
import Modal from '../../common/components/NewElementModal/NewElementModal';
import { boardInputRegex } from '../../common/constants/regExp';

type PropsType = {
  boards: Board[];
  getBoards: () => void;
  createBoard: (title: string) => void;
  deleteBoard: (id: number) => void;
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
      <div className="container">
        <h3 className="table-name">Мои Доски</h3>
        <div className="table-board">
          {boards &&
            boards.map((el) => {
              return <IconBoard key={el.id} board={el} handleClickDeleteBoard={this.handleClickDeleteBoard} />;
            })}
        </div>
        {isVisibleModal && (
          <Modal
            toggleModal={this.toggleModal}
            handleValueModal={this.handleValueModal}
            handleClickCreateElement={this.handleClickCreateElement}
          />
        )}
        <div className="add-item-container">
          <button
            className="add-item"
            onClick={(): void => {
              return this.toggleModal();
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: AppState): { boards: Board[] } => ({
  boards: store.boards,
});

export default connect(mapStateToProps, { getBoards, createBoard, deleteBoard })(Home);
