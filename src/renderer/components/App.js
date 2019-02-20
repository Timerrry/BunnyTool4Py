import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './App.global.scss';
import '../assets/font/bunny.css';
import '../assets/font/timerry.js';
import '../assets/font/iconfont.css';
import styles from './App.scss';

const App = ({children}) => {
  return (
    <div className={styles.app}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
