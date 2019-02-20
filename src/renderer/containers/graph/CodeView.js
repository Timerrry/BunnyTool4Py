import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, message } from 'antd';

import CodeViewComponent from '../../components/graph/CodeView';
import { switchRightTab, resizeRightTab, setEditor } from '../../reducers/graph/view';
import { updateBlockly } from '../../reducers/graph/project';

class CodeView extends Component {

  _handleSwitchTab(tab) {
    const { dispatch } = this.props;
    dispatch(switchRightTab(tab));
  }

  _handleResizeStop(delta) {
    const { dispatch, width } = this.props;
    dispatch(resizeRightTab(width + delta.width));
  }

  _handleResize() {
    this.editor && this.editor.layout();
  }

  _handleEditorDidMount(editor) {
    const { dispatch } = this.props;
    dispatch(setEditor(editor));

    this.editor = editor;
    editor.layout();
  }

  _handleRenderCode() {
    // demo: convert & render

    const { dispatch } = this.props;

    const code = `
      void setup() {
        pinMode(13, OUTPUT);
      }
      
      void blink(int interval) {
        digitalWrite(13, HIGH);
        delay(interval);
        digitalWrite(13, LOW);
        delay(interval);
      }
      
      void loop() {
        int bar;
        int i = 0;
        while (i < 5) {
          blink(1000);
        }
        while (1 > 0);
      }
    `
  
    bridge.postMessage("converter.convert", code).then(res => {
      dispatch(updateBlockly({ code: code, dom: res }));
    });
  }

  render() {
    const { active, width, fullscreen, code } = this.props;

    return (
      <CodeViewComponent
        active={active}
        width={width}
        fullscreen={fullscreen}
        language="cpp"
        theme="vs"
        code={code}
        onSwitchTab={::this._handleSwitchTab}
        onResizeStop={::this._handleResizeStop}
        onResize={::this._handleResize}
        onEditorDidMount={::this._handleEditorDidMount}
      />
    )
  }
}

CodeView.propTypes = {
  active: PropTypes.bool.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  code: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  active: state.graph.view.rightTab.tab === "code-view",
  width: state.graph.view.rightTab.width,
  fullscreen: state.graph.view.fullscreen,
  code: state.graph.project.blockly.code,
});

export default connect(mapStateToProps)(CodeView);
