import { connect } from 'react-redux';
import React from 'react';
import Board from '../../common/interfaces/Board';
import IconBoard from './components/Board/Board';
import './home.scss';
import { getBoards } from '../../store/modules/boards/actions';

type PropsType = {
  boards: Board[];
  getBoards: () => Promise<void>;
};
type StateType = {
  boards: Board[];
};

class Home extends React.Component<PropsType, StateType> {
  async componentDidMount(): Promise<void> {
    // eslint-disable-next-line react/destructuring-assignment
    await this.props.getBoards();
  }

  render(): JSX.Element {
    const { boards } = this.props;
    return (
      <div className="container">
        <h3 className="table-name">Мои Доски</h3>
        <div className="table-board">
          {boards.map((el) => {
            return IconBoard(el);
          })}
        </div>
        <div className="btn-container">
          <button className="add-list">+</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StateType): Board[] => ({
  ...state.boards,
});

export default connect(mapStateToProps, { getBoards })(Home);
