import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types';

class Confirm extends Component {

  _handleAction(action) {
    const { close } = this.props;
    if(!action) {
      close();
      return;
    }

    let ret = action();
    if(!ret || !ret.then) {
      close();
      return;
    }

    ret.then(close);
  }

  render() {
    const { visible, title, content, okText, skipText, cancelText, onOK, onSkip, onCancel, afterClose, ...props } = this.props;

    return (
      <Modal
        visible={visible}
        title={title}
        onCancel={() => this._handleAction(onCancel)}
        afterClose={afterClose}
        footer={[
          <Button key="ok" onClick={() => this._handleAction(onOK)} autoFocus>{okText}</Button>,
          <Button key="skip" onClick={() => this._handleAction(onSkip)}>{skipText}</Button>,
          <Button key="cancel" onClick={() => this._handleAction(onCancel)}>{cancelText}</Button>,
        ]}
        {...props}
      >
        {content}
      </Modal>
    );
  }
}

Confirm.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  okText: PropTypes.string.isRequired,
  skipText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  onOK: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  afterClose: PropTypes.func,
};

Confirm.defaultProps = {
  title: "提示",
  content: '',
  okText: "确定",
  skipText: "跳过",
  cancelText: "取消",
  onOK: () => {},
  onSkip: () => {},
  onCancel: () => {},
};

Confirm.show = config => {
  let node = document.createElement('div');
  document.body.appendChild(node);

  function close(...args) {
    render({ ...config, visible: false, close, afterClose: destroy.bind(this, ...args) });
  }

  function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(node);
    if (unmountResult && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  function render(props) {
    ReactDOM.render(<Confirm {...props} />, node);
  }

  render({ ...config, visible: true, close });

  return {
    destroy: close,
  };
}

export default Confirm;
