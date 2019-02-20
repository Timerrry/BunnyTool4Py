import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import styles from './Blockly.scss';

class BlocklyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };

    this._handleChange = this._handleChange.bind(this);
    this._throttleResize = throttle(() => Blockly.svgResize(Blockly.getMainWorkspace()), 100);

    window.addEventListener("resize", this._throttleResize);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.value !== nextProps.value && nextProps.value !== this.state.value) {
      this._renderBlockly(nextProps.value);
    }
    if(this.props.board !== nextProps.board) {
      Blockly.Arduino.Boards.changeBoard(Blockly.getMainWorkspace(), nextProps.board);
    }
    if(this.props.configs !== nextProps.configs) {
      Blockly.Blocks.extensions.updateConfigs(nextProps.configs);
    }
    if(this.props.toolbox !== nextProps.toolbox) {
      Blockly.getMainWorkspace().updateToolbox(nextProps.toolbox);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const { options, toolbox, value } = this.props;

    let workspace = Blockly.inject(this.refs.container, {...options, toolbox});
    workspace.addChangeListener(this._handleChange);
    this._renderBlockly(value);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._throttleResize);

    let workspace = Blockly.getMainWorkspace();
    if(!workspace) {
      return;
    }

    workspace.removeChangeListener(this._handleChange);
    workspace.dispose();
  }

  _handleChange(e) {
    let workspace = Blockly.getMainWorkspace();
    if(!workspace) {
      return;
    }

    const { onChange } = this.props;
    const { value } = this.state;
    let dom = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));

    if(value === dom) {
      return;
    }

    let code = Blockly.Arduino.workspaceToCode(workspace);
    this.setState({value: dom});
    onChange({dom, code});
  }

  _renderBlockly(value) {
    let workspace = Blockly.getMainWorkspace();
    if(!workspace) {
      return;
    }

    try {
      workspace.clear();
      let xml = Blockly.Xml.textToDom(value);
      Blockly.Xml.domToWorkspace(xml, workspace);
      workspace.cleanUp_();
    } catch(ex) {
      console.log(ex);
    }
  }

  render() {
    return (
      <div className={styles.container} ref="container" />
    );
  }
}

BlocklyComponent.propTypes = {
  options: PropTypes.object.isRequired,
  toolbox: PropTypes.string.isRequired,
  board: PropTypes.string.isRequired,
  value: PropTypes.string,
  configs: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

BlocklyComponent.defaultProps = {
  options: {},
  toolbox: '',
  board: 'uno',
  configs: {},
  onChange: () => {},
};

export default BlocklyComponent;
