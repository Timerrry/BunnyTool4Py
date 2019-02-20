import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import EditSpan from './EditSpan';
import styles from './Header.scss';
import logo from '../../assets/image/logo.svg';

const Header = ({ meta, children, style, titleStyle, buttonStyle, onMinClick, onMaxClick, onQuitClick }) => {
  return (
    <div className={styles.header} style={style}>
      <img className={styles.logo} src={logo} draggable="false" width="30px" height="30px" />
      <span className={styles.title} style={titleStyle}>{/*meta.name || ""*/ "BunnyTool"}</span>
      <span className={styles.placeholder}>
        { children }
      </span>
      <div className={styles.btns}>
        <span className={styles.btn} style={buttonStyle} onClick={() => onMinClick()}><i className="bunny bunny-minimize"></i></span>
        <span className={styles.btn} style={buttonStyle} onClick={() => onMaxClick()}><i className="bunny bunny-maximize"></i></span>
        <span className={styles.btn} style={buttonStyle} onClick={() => onQuitClick()}><i className="bunny bunny-close"></i></span>
      </div>
    </div>
  );
}

Header.propTypes = {
  meta: PropTypes.object.isRequired,
  children: PropTypes.node,
  style: PropTypes.object,
  titleStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  onMinClick: PropTypes.func.isRequired,
  onMaxClick: PropTypes.func.isRequired,
  onQuitClick: PropTypes.func.isRequired,
};

export default Header;
