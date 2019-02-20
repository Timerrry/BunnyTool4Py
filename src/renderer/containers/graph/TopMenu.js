import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { push } from 'connected-react-router';

import { toggle as toggleSerialMonitor } from '../../reducers/common/serialMonitor';
import { toggleFullscreen, toggleRightTab, switchRightTab } from '../../reducers/graph/view';
import { setPort } from '../../reducers/graph/config';

import emitor from '../../lib/emitor';

import TopMenuComponent from '../../components/graph/TopMenu';

class TopMenu extends Component {

  _handleNew() {
    emitor.emit("app.command.new");
  }

  _handleOpen() {
    emitor.emit("app.command.open");
  }

  _handleSave() {
    emitor.emit("app.command.save");
  }

  _handleUpload() {
    emitor.emit("app.command.upload");
  }

  _handleToggleSerial() {
    const { dispatch } = this.props;
		dispatch(toggleSerialMonitor());
  }

  _handlePortChange(comName) {
    const { dispatch } = this.props;
		dispatch(setPort(comName));
  }

  _handleFullscreen() {
    const { dispatch } = this.props;
    bridge.postMessage("app.fullscreen", true).then(() => {
      dispatch(toggleFullscreen(true));
      dispatch(toggleRightTab(false));
      dispatch(switchRightTab("code-view"));
    });
  }

  _handleShare() {
    message.info("敬请期待");
    // const { dispatch } = this.props;
		// dispatch(push("/"));
  }

  render() {
    const { comName, ports } = this.props;
    return (
      <TopMenuComponent
        comName={comName}
        ports={ports}
        onNew={::this._handleNew}
        onOpen={::this._handleOpen}
        onSave={::this._handleSave}
        onUpload={::this._handleUpload}
        onToggleSerial={::this._handleToggleSerial}
        onPortChange={::this._handlePortChange}
        onFullscreen={::this._handleFullscreen}
        onShare={::this._handleShare}
      />
    )
  }
}

TopMenu.propTypes = {
  comName: PropTypes.string.isRequired,
  ports: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  comName: state.graph.config.port,
  ports: state.graph.config.ports,
});

export default connect(mapStateToProps)(TopMenu);
