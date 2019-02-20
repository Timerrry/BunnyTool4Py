import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, message } from 'antd';
import Moment from 'react-moment';
import { push } from 'connected-react-router';
import { setVersion } from '../../reducers/common/setting/version';
import emitor from '../../lib/emitor';
import HelpComponent from '../../components/graph/Help';

class Help extends Component {

  _showAbout() {
		const { meta } = this.props;
		Modal.info({
			// title: meta.name,
			title: "BunnyTool",
			content: (
				<div>
					<div>当前版本：{meta.version}({meta.platform} {meta.appBit})</div>
					<div>发行时间：<Moment unix format="YYYY-MM-DD">{meta.date}</Moment></div>
				</div>
			),
			okText: "确定",
		});
  }

  _handleMenuClick(key) {
		const { dispatch } = this.props;
		switch(key) {
			case "switch-text":
				emitor.emit("app.switch", () => {
					dispatch(push("/text"));
					dispatch(setVersion("text"));
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
    return (
      <HelpComponent onMenuClick={::this._handleMenuClick} />
    )
  }
}

Help.propTypes = {
  meta: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  meta: state.common.meta,
});

export default connect(mapStateToProps)(Help);
