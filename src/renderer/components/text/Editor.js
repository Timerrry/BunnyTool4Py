import React, { Component} from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import ReactResizeDetector from 'react-resize-detector';

import styles from './Editor.scss';

const Editor = ({ language, theme, code, onEditorDidMount, onResize }) => {
  return (
    <div className={styles.editor}>
      <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
      <MonacoEditor
        language={language}
        theme={theme}
        value={code}
        editorDidMount={onEditorDidMount}
      />
    </div>
  );
}

Editor.propTypes = {
  language: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  onEditorDidMount: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
};

export default Editor;
