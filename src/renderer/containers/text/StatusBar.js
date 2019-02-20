import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, message } from 'antd';
import Moment from 'react-moment';
import { push } from 'connected-react-router';
import { setVersion } from '../../reducers/common/setting/version';
import StatusBarComponent from '../../components/text/StatusBar';
import emitor from '../../lib/emitor';

class StatusBar extends Component {

	componentDidMount() {
		emitor.on("app.command.showAbout", ::this._showAbout);
	}

	componentWillUnmount() {
		emitor.removeAllListeners("app.command.showAbout");
	}

	_showAbout() {
		const { meta } = this.props;
		Modal.info({
			// title: meta.name,
			title: "Bunny",
			content: (
				<div>
					<div>当前版本：{meta.version}({meta.platform} {meta.appBit})</div>
					<div>发行时间：<Moment unix format="YYYY-MM-DD">{meta.date}</Moment></div>
				</div>
			),
			okText: "确定",
		});
	}

	_handleHelpMenu(key) {
		const { dispatch } = this.props;

		switch(key) {
			case "switch-graph":
				emitor.emit("app.switch", () => {
					dispatch(push("/graph"));
					dispatch(setVersion("graph"));
				});
				break;
			case "install-driver":
				message.info(`敬请期待`);
				break;
			case "check-update":
				message.info(`敬请期待`);
				break;
			case "office-web":
				bridge.postMessage("url.open", "http://www.bunnyzoo.com");
				break;
			case "suggest":
				message.info(`敬请期待}`);
				break;
			case "about":
				this._showAbout();
				break;
		}
	}

	render() {
		let { message, projectPath, updatedAt, buildMessage, buildError } = this.props;

		return (
			<StatusBarComponent
				message={message}
				hasSave={!!projectPath}
				updatedAt={updatedAt}
				buildMessage={buildMessage}
				buildError={buildError}
				onHelpMenuClick={::this._handleHelpMenu}
			/>
		)
	}
}

StatusBar.propTypes = {
	message: PropTypes.string.isRequired,
	projectPath: PropTypes.string.isRequired,
	buildMessage: PropTypes.string.isRequired,
	updatedAt: PropTypes.number.isRequired,
	meta: PropTypes.object.isRequired,
	buildError: PropTypes.string,
};

const mapStateToProps = state => ({
	meta: state.common.meta,
	message: state.text.build.statusMessage,
	buildMessage: state.text.build.buildMessage,
	projectPath: state.text.project.path,
	updatedAt: state.text.project.updatedAt,
	buildError: state.text.build.buildError,
});

export default connect(mapStateToProps)(StatusBar);
