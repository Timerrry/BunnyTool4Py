import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EditorComponent from '../../components/text/Editor';
import { setEditor } from '../../reducers/text/editor';
import { updateFile, EXT } from '../../reducers/text/project';

class Editor extends Component {

  componentWillReceiveProps (nextProps) {
    const { dispatch, language } = this.props;
    const { tabSize, fontSize, lineHeight, style } = nextProps;
    let editor = this.editor;
    if(!editor) {
      return
    }

    if(fontSize !== this.props.fontSize) {
      editor.updateOptions({fontSize});
    }
    if(lineHeight !== this.props.lineHeight) {
      editor.updateOptions({lineHeight});
    }
    if(tabSize !== this.props.tabSize) {
      editor.getModel().updateOptions({tabSize});
    }
    if(style !== this.props.style) {
      let ext = EXT[language] || "cpp";
		  let code = editor.getValue();
      bridge.postMessage("editor.formatCode", code, ext, { style })
      .then(newCode => {
        if(newCode === code) {
          return
        }

        let model = editor.getModel();
        model.pushEditOperations([], [{range: model.getFullModelRange(), text: newCode}]);
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setEditor(null));
  }

  _handleResize() {
    this.editor && this.editor.layout();
  }

  _handleEditorDidMount(editor) {
    const { dispatch } = this.props;
    dispatch(setEditor(editor));

    this.editor = editor;
    editor.layout();
    editor.onDidBlurEditorText(() => {
      const { index } = this.props;
      dispatch(updateFile(index, {content: editor.getValue()}));
    });
  }

  render() {
    const { language, theme, index, files } = this.props;
    const currentFile = files.length > 0 ? files[index] : null;
    const code = currentFile && currentFile.content || "";
    return (
      <EditorComponent
        language={language}
        theme={theme}
        code={code}
        onResize={::this._handleResize}
        onEditorDidMount={::this._handleEditorDidMount}
      />
    );
  }
}

Editor.propsType = {
  index: PropTypes.number.isRequired,
  files: PropTypes.array.isRequired,
  style: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  tabSize: PropTypes.number.isRequired,
  lineHeight: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  index: state.text.project.index,
  files: state.text.project.files,
  style: state.common.setting.editor.style,
  language: state.common.setting.editor.language,
  theme: state.common.setting.editor.theme,
  fontSize: state.common.setting.editor.fontSize,
  tabSize: state.common.setting.editor.tabSize,
  lineHeight: state.common.setting.editor.lineHeight,
});

export default connect(mapStateToProps)(Editor);
