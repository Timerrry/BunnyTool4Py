import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Resizable from "re-resizable";
import MonacoEditor from 'react-monaco-editor';
import ReactResizeDetector from 'react-resize-detector';

import styles from './CodeView.scss';

const CodeView = ({ active, width, fullscreen, language, theme, code, onSwitchTab, onResizeStop, onResize, onEditorDidMount }) => {
  return (
    <Resizable className={classNames(styles.containerWrap, {[styles.containerWrapActive]: active})} defaultSize={{width: width || styles.width}} enable={{left: true}} handleStyles={{left: {cursor: 'w-resize'}}} onResizeStop={(e, dir, ref, delta) => onResizeStop(delta)}>
      <div className={styles.container}>
        {!fullscreen ?
        <div className={styles.title}>
          <span className={styles.tabTitle} onClick={() => onSwitchTab("component-detail")}>元件规格</span>
          <span className={classNames(styles.tabTitle, styles.tabTitleActive)}>代码</span>
        </div> : null
        }
        <div className={styles.content}>
          <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
          <MonacoEditor
            language={language}
            theme={theme}
            value={code}
            options={{readOnly: true, renderLineHighlight: "none"}}
            editorDidMount={onEditorDidMount}
          />
        </div>
      </div>
    </Resizable>
  );
};

CodeView.propTypes = {
  active: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  onSwitchTab: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onEditorDidMount: PropTypes.func.isRequired,
};

export default CodeView;
