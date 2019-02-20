import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Home.scss';

import logo from '../../assets/image/logo.svg';
import textImg from '../../assets/image/text.png';
import graphImg from '../../assets/image/graph.png';

const Home = ({ name, onClose, onSelectVersion }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.close} onClick={() => onClose()}><i className="bunny bunny-close"></i></span>
        <img className={styles.logo} src={logo} draggable="false" width="30px" height="30px" />
        <span className={styles.title}>{name}</span>
      </div>
      <div className={styles.tips}>请选择首次打开的版本</div>
      <div className={styles.versions}>
        <img className={styles.version} src={textImg} draggable="false" title="文本版" width="150px" height="150px"  onClick={() => onSelectVersion("text")} />
        <img className={styles.version} src={graphImg} draggable="false" title="图形版" width="150px" height="150px" onClick={() => onSelectVersion("graph")} />
      </div>
    </div>
  );
};

Home.propTypes = {
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectVersion: PropTypes.func.isRequired,
};

export default Home;
