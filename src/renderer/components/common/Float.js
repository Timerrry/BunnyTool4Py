import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Float.scss';

const Float = ({ children }) => {
  return (
    <div className={styles.float}>
      { children }
    </div>
  );
};

export default Float;
