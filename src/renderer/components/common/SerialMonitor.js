import React, { Component } from 'react';
import Resizable from "re-resizable";
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Input, Checkbox, Button, Select } from 'antd';
const { Option } = Select;

import styles from './SerialMonitor.scss';

const animationStyles = {
	enter: styles.enter,
	enterActive: styles.enterActive,
	exit: styles.exit,
  exitActive: styles.exitActive,
};

const SerialMonitor = ({ visible, height, input, output, connected, autoScroll, comName, ports, lineEnding, baudrate, setInputRef, setOutputRef, onEntered, onExited, onHide, onResizeStop, onInputChange, onSend, onClear, onAutoScrollChange, onOpenSerial, onRunPython, onSendCtrlC, onPortChange, onLineEndingChange, onBaudrateChange }) => {
  return (
    <CSSTransition in={visible} timeout={300} classNames={animationStyles} onEntered={onEntered} onExited={onExited} unmountOnExit>
      <Resizable className={styles.container} defaultSize={{height: height || styles.height}} enable={{top: true}} handleStyles={{top: {cursor: 'n-resize'}}} onResizeStop={(e, dir, ref, delta) => onResizeStop(delta)}>
        <div className={styles.containerWrap}>
          <div className={styles.header}>
            <span className={styles.title}>MicroPython终端</span>
            {connected? <span className={styles.connectedPort}>{comName}</span> : null}
            <span className={styles.placeholder}></span>
            <span className={styles.close} onClick={onHide}><i className="bunny bunny-close"></i></span>
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <Input autoFocus className={styles.input} value={input} onChange={onInputChange} onPressEnter={onSend} ref={setInputRef} />
              <Button className={styles.send} onClick={onSend} disabled={!connected} >发送</Button>
            </div>
            <div className={styles.outputWrap}>
              <textarea className={styles.output} value={output} ref={setOutputRef} readOnly></textarea>
            </div>
            <div className={styles.footer}>
              <Checkbox className={styles.autoScroll} checked={autoScroll} onChange={e => onAutoScrollChange(e.target.checked)}>自动滚屏</Checkbox>
              <Button className={styles.clear} onClick={onClear}>清屏</Button>
              <span className={styles.placeholder}></span>
              <Button className={styles.open} onClick={onOpenSerial}>{connected? '关闭串口' : '打开串口'}</Button>
              <Button className={styles.open} onClick={onRunPython} disabled={!connected} >开始调试</Button>
              {/* <Button className={styles.open} onClick={onUploadPythonTest} disabled={!connected} >上传测试</Button> */}
              <Button className={styles.ctrlc} onClick={onSendCtrlC} disabled={!connected} >中断（Ctrl+C）</Button>
            </div>
          </div>
        </div>
      </Resizable>
    </CSSTransition>
  );
};

SerialMonitor.propTypes = {
  visible: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  connected: PropTypes.bool.isRequired,
  input: PropTypes.string.isRequired,
  output: PropTypes.string.isRequired,
  autoScroll: PropTypes.bool.isRequired,
  comName: PropTypes.string.isRequired,
  ports: PropTypes.array.isRequired,
  lineEnding: PropTypes.string.isRequired,
  baudrate: PropTypes.number.isRequired,
  onEntered: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  setOutputRef: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onAutoScrollChange: PropTypes.func.isRequired,
  onOpenSerial: PropTypes.func.isRequired,
  onRunPython: PropTypes.func.isRequired,
  onSendCtrlC: PropTypes.func.isRequired,
  onPortChange: PropTypes.func.isRequired,
  onLineEndingChange: PropTypes.func.isRequired,
  onBaudrateChange: PropTypes.func.isRequired,
  // onUploadPythonTest: PropTypes.func.isRequired,
};

export default SerialMonitor;
