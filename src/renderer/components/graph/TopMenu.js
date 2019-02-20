import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Select } from 'antd';
import styles from './TopMenu.scss';

const Option = Select.Option;

const TopMenu = ({ comName, ports, onNew, onOpen, onSave, onUpload, onToggleSerial, onPortChange, onFullscreen, onShare }) => {
  return (
    <div className={styles.container}>
      <span className={classNames(styles.placeholder, styles.flex)}>
        <span className={classNames(styles.btn, styles.new)} onClick={() => onNew()}>
          <i className="bunny bunny-new"></i>
          <span className={styles.label}>新建</span>
        </span>
        <span className={styles.btn} onClick={() => onOpen()}>
          <i className="bunny bunny-open"></i>
          <span className={styles.label}>打开</span>
        </span>
        <span className={styles.btn} onClick={() => onSave()}>
          <i className="bunny bunny-save"></i>
          <span className={styles.label}>保存</span>
        </span>
      </span>
      <span className={styles.flex}>
        <span className={styles.btn} onClick={() => onUpload()}>
          <i className="bunny bunny-upload"></i>
          <span className={styles.label}>上传</span>
        </span>
        <span className={styles.btn} onClick={() => onToggleSerial()}>
          <i className="bunny bunny-serial"></i>
          <span className={styles.label}>串口监视器</span>
        </span>
      </span>
      <span className={classNames(styles.placeholder, styles.flex, styles.right)}>
        <span className={classNames(styles.item, styles.ports)}>
          <span className={styles.itemLabel}>端口：</span>
          <Select value={comName} onChange={onPortChange} notFoundContent="未发现串口">
          {ports.map((port,index) => <Option key={index} value={port.comName} title={port.comName}>{port.comName}</Option>)}
          </Select>
        </span>
        <span className={styles.btn} onClick={() => onFullscreen()}>
          <i className="bunny bunny-fullscreen"></i>
          <span className={styles.label}>全屏</span>
        </span>
        <span className={classNames(styles.btn, styles.share)} onClick={() => onShare()}>
          <i className="bunny bunny-share"></i>
          <span className={styles.label}>分享</span>
        </span>
      </span>
    </div>
  );
};

TopMenu.propTypes = {
  comName: PropTypes.string.isRequired,
  ports: PropTypes.array.isRequired,
  onNew: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onToggleSerial: PropTypes.func.isRequired,
  onPortChange: PropTypes.func.isRequired,
  onFullscreen: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default TopMenu;
