import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import BoardComponent from '../../components/graph/Board';
import { setBoard } from '../../reducers/graph/project';
import { toggleBoardExpand } from '../../reducers/graph/view';

class Board extends Component {

  _handleToggleExpand() {
    const { dispatch } = this.props;
    dispatch(toggleBoardExpand());
  }

  _handleBoardChange(board) {
    const { dispatch } = this.props;
    if(board === "microbit" || board === "NodeMCU") {
      message.info("敬请期待");
      return;
    }
    dispatch(setBoard(board));
  }

  render() {
    const { boards, current, expand } = this.props;

    return (
      <BoardComponent
        expand={expand}
        boards={boards}
        current={current}
        onToggleExpand={::this._handleToggleExpand}
        onBoardChange={::this._handleBoardChange}
      />
    )
  }
}

Board.propTypes = {
  boards: PropTypes.array.isRequired,
  current: PropTypes.string.isRequired,
  expand: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  boards: state.graph.config.boards,
  current: state.graph.project.board,
  expand: state.graph.view.boardExpand,
});

export default connect(mapStateToProps)(Board);
