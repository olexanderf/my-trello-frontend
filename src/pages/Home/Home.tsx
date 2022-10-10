import { connect } from 'react-redux';
import React from 'react';
import Board from '../../common/interfaces/Board';
import IconBoard from './components/Board/Board';
import './home.scss';

type PropsType = {
  boards: Board[];
};

type StateType = {
  boards: Board[];
};

class Home extends React.Component<PropsType, StateType> {
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

export default connect(mapStateToProps, {})(Home);
