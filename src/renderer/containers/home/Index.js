import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { push } from 'connected-react-router';
import { Redirect } from "react-router-dom";

import { setVersion } from '../../reducers/common/setting/version';
import Home from '../../components/home/Home';

class Index extends Component {

	componentWillMount() {
    this._loadSetting();
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	_handleClose() {
		bridge.postMessage("app.exit");
	}

	_handleSelectVersion(version) {
		const { dispatch, setting } = this.props;

		bridge.postMessage("config.saveSetting", {...setting, version});
		dispatch(setVersion(version));
		dispatch(push(`/${version}`));
		bridge.postMessage("app.hide");
		// setTimeout(() => bridge.postMessage("app.show"), 200);
	}

	_loadSetting() {
		const self = this;
		const { dispatch } = this.props;
		let setting;
		bridge.postMessage("config.loadSetting")
		.then(result => {
			setting = result;
			dispatch(setVersion(setting.version || ""));
		})
		.finally(() => {
			(!setting || !setting.version) && bridge.postMessage("app.lockSize", 500, 350);
			self.timer = setTimeout(() => bridge.postMessage("app.show"), 50);
		});
  }

  render() {
		const { name, version } = this.props;

		if(version === "text" || version === "graph") {
			return <Redirect to={`/${version}`} />
		}

    return (
      <Home name={name} onClose={::this._handleClose} onSelectVersion={::this._handleSelectVersion} />
    )
  }
}

Index.propTypes = {
	name: PropTypes.string.isRequired,
	version: PropTypes.string.isRequired,
	setting: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	// name: state.common.meta.name || "",
	name: "BunnyTool",
	version: state.common.setting.version,
	setting: state.common.setting,
});

export default connect(mapStateToProps)(Index);
