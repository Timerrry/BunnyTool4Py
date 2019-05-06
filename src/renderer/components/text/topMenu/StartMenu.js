import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Tooltip } from 'antd';
import classNames from 'classnames';
const Option = Select.Option;

import styles from './StartMenu.scss';

const delay = 0.5;

const StartMenu = ({ active, boardName, boards, comName, ports, buildAndUploadLock, onUploadPython, onSaveProject, onGetFileList, onOpenPythonTerminal, onPortChange, onPortList, onBoardChange, onUploadRun }) => {
  return (
    <div className={classNames(styles.menu, {[styles.active]: active})}>
      <span className={classNames(styles.btn, {[styles.btnDisable]: buildAndUploadLock})} onClick={() => onGetFileList()}>
        <span className={styles.btnIcon}>
        <i className={classNames("bunny bunny-open", styles.btnIcon)}></i>
          {/* <svg className={classNames("", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#bunny-open"></use>
          </svg> */}
        </span>
        <span className={styles.btnLabel}>文件列表</span>
      </span>
      <span className={classNames(styles.btn, {[styles.btnDisable]: buildAndUploadLock})} onClick={() => !buildAndUploadLock && onSaveProject()}>
        <span className={styles.btnIcon}>
        <i className={classNames("bunny bunny-save", styles.btnIcon)}></i>
          {/* <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_yanzheng"></use>
          </svg> */}
        </span>
        <span className={styles.btnLabel}>保存</span>
      </span>
      <span className={styles.divider}></span>
      <span className={styles.btn} onClick={onOpenPythonTerminal}>
        <span className={styles.btnIcon}>
        <i className={classNames("bunny bunny-terminal", styles.btnIcon)}></i>
          {/* <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_chuankoujianshiqi"></use>
          </svg> */}
        </span>
        <span className={styles.btnLabel}>终端</span>
      </span>
      <span className={classNames(styles.btn, {[styles.btnDisable]: buildAndUploadLock})} onClick={() => onUploadPython()}>
        <span className={styles.btnIcon}>
        <i className={classNames("bunny bunny-upload", styles.btnIcon)}></i>
          {/* <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_shangchuan1"></use>
          </svg> */}
        </span>
        <span className={styles.btnLabel}>上传</span>
      </span>
      <span className={classNames(styles.btn, {[styles.btnDisable]: buildAndUploadLock})} onClick={() => onUploadRun()}>
        <span className={styles.btnIcon}>
        <i className={classNames("bunny bunny-upload", styles.btnIcon)}></i>
            {/* <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_shangchuan1"></use>
          </svg> */}
        </span>
        <span className={styles.btnLabel}>上传并运行</span>
      </span>
      {/* <span className={styles.btn} onClick={() =>  onRunPython()}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_shili"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>测试</span>
      </span> */}
      <span className={styles.placeholder}></span>
      <span className={styles.label}>开发板：</span>
			<Select className={classNames(styles.select, styles.boards)} value={boardName} onChange={onBoardChange}>
			{boards.map((board,index) => <Option key={index} value={board.name} title={board.label}>{board.label}</Option>)}
      </Select>
      {/* <span className={styles.label}>端口：</span>
			<Select className={classNames(styles.select, styles.ports)} value={comName} onChange={onPortChange} onFocus={onPortList} notFoundContent="未发现串口">
			{ports.map((port,index) => <Option key={index} value={port.comName} title={port.comName}>{port.comName}</Option>)}
			</Select> */}
      {/* <span className={styles.placeholder}></span> */}
      <span className={styles.label}>端口：</span>
			<Select className={classNames(styles.select, styles.ports)} value={comName} onChange={onPortChange} onFocus={onPortList} notFoundContent="未发现串口">
			{ports.map((port,index) => <Option key={index} value={port.comName} title={port.comName}>{port.comName}</Option>)}
			</Select>
    </div>
  );
};

StartMenu.propTypes = {
  // active: PropTypes.bool.isRequired,
  boardName: PropTypes.string.isRequired,
  boards: PropTypes.array.isRequired,
  comName: PropTypes.string.isRequired,
  ports: PropTypes.array.isRequired,
  onUploadPython: PropTypes.func.isRequired,
	onSaveProject: PropTypes.func.isRequired,
	onGetFileList: PropTypes.func.isRequired,
  onOpenPythonTerminal: PropTypes.func.isRequired,
  onBoardChange: PropTypes.func.isRequired,
  onPortChange: PropTypes.func.isRequired,
  onPortList: PropTypes.func.isRequired,
  onRunPython: PropTypes.func.isRequired,
};

export default StartMenu;
