import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import classNames from 'classnames';

import styles from './GraphCoder.scss';

const GraphCoder = ({ keyMap, handlers, header, topMenu, toolbox, list, blockly, board, detail, codeView, help, float, fullscreen, rightTabActive, onExitFullscreen, onToggleCodeView }) => {
  return (
    <HotKeys keyMap={keyMap} handlers={handlers} className={styles.wrap}>
      <div className={classNames(styles.container, {[styles.fullscreen]: fullscreen})}>
        <div className={styles.top}>
          { header }
          { topMenu }
        </div>
        <div className={styles.content}>
          <div className={styles.left}>
            {toolbox}
            {list}
          </div>
          <div className={styles.divider}></div>
          <div className={styles.center}>
            {blockly}
            <div className={styles.board}>{board}</div>
            {fullscreen ? <span className={styles.exit} title="退出全屏" onClick={() => onExitFullscreen()}><i className="bunny bunny-exit"></i></span> : null}
            {fullscreen ? <span className={styles.code} title={rightTabActive ? "折叠代码" : "显示代码"} onClick={() => onToggleCodeView()}><i className="bunny bunny-code"></i></span> : null}
          </div>
          <div className={styles.divider}></div>
          <div className={classNames(styles.right, {[styles.rightActive]: rightTabActive})}>
            <div className={styles.detail}>{detail}</div>
            <div className={styles.codeView}>{codeView}</div>
            <div className={styles.help}>{help}</div>
          </div>
        </div>
        <div className={styles.float}>
          {float}
        </div>
      </div>
    </HotKeys>
  );
};

GraphCoder.propTypes = {
  keyMap: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  header: PropTypes.node.isRequired,
  topMenu: PropTypes.node.isRequired,
  toolbox: PropTypes.node.isRequired,
  list: PropTypes.node.isRequired,
  blockly: PropTypes.node.isRequired,
  board: PropTypes.node.isRequired,
  detail: PropTypes.node.isRequired,
  codeView: PropTypes.node.isRequired,
  help: PropTypes.node.isRequired,
  float: PropTypes.node.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  rightTabActive: PropTypes.bool.isRequired,
  onExitFullscreen: PropTypes.func.isRequired,
  onToggleCodeView: PropTypes.func.isRequired,
};

export default GraphCoder;
