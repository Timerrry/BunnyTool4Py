import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';

import styles from './TextCoder.scss';

const TextCoder = ({ keyMap, handlers, header, topMenu, statusBar, float, children, fileList }) => {
  return (
    <HotKeys keyMap={keyMap} handlers={handlers} className={styles.wrap}>
      <div className={styles.root}>
        {header}
        {topMenu}
        <div className={styles.container}>
          {fileList}
          <div className={styles.containercenter}>
            <div className={styles.top}>
              <div className={styles.right}>
                <div className={styles.content}>
                  {children}
                </div>
              </div>
            </div>
            {statusBar}
            {float}
          </div>
        </div>
      </div>
    </HotKeys>
  );
};

TextCoder.propTypes = {
  keyMap: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  header: PropTypes.node.isRequired,
  topMenu: PropTypes.node.isRequired,
  statusBar: PropTypes.node.isRequired,
  fileList: PropTypes.node.isRequired,
  float: PropTypes.node,
  children: PropTypes.node,
};

export default TextCoder;
