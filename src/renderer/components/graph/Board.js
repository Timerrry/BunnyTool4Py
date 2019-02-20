import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Board.scss';
import { Select } from 'antd';

const Option = Select.Option;

const Board = ({ expand, boards, current, onBoardChange, onToggleExpand }) => {
  let board = boards.find(b => b.name === current)
  if(expand) {
    return (
      <div className={classNames(styles.container, styles.expand)}>
        <div className={styles.expandContent}>
          <div className={styles.header}>
            <span className={styles.placeholder}></span>
            <span className={styles.boards}>
              <Select value={current} onChange={value => onBoardChange(value)}>
              {boards.map((b,index) => <Option key={index} value={b.name}>{b.label}</Option>)}
              </Select>
            </span>
            <span className={classNames(styles.placeholder, styles.foldWrap)}>
              <span className={styles.fold} onClick={() => onToggleExpand()}><i className="bunny bunny-fold-1"></i></span>
            </span>
          </div>
          <div className={styles.body}>
            {board ? <img className={styles.image} draggable="false" src={`${board.img.startsWith("/") ? "file://" : "file:///"}${board.img}`} /> : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.foldContent}>
        <span className={styles.icon}><i className="bunny bunny-arduino"></i></span>
        <span className={styles.current} title={board && (board.fullname || board.label) || ""}>{board && board.label || ""}</span>
        <span className={styles.expand} onClick={() => onToggleExpand()}><i className="bunny bunny-expand-1"></i></span>
      </div>
    </div>
  );
};

Board.propTypes = {
  expand: PropTypes.bool.isRequired,
  boards: PropTypes.array.isRequired,
  current: PropTypes.string.isRequired,
  onBoardChange: PropTypes.func.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};

export default Board;
