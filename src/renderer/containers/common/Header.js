import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HeaderComponent from '../../components/common/Header';

class Header extends Component {

  constructor(props) {
    super(props);
    this._handleAppBeforeQuit = this._handleAppBeforeQuit.bind(this);
  }

  componentDidMount() {
    bridge.listenMessage("app.onBeforeQuit", this._handleAppBeforeQuit);
  }

  componentWillUnmount() {
		bridge.unlistenMessage("app.onBeforeQuit", this._handleAppBeforeQuit);
  }

  _handleAppBeforeQuit() {
		bridge.postMessage("app.exit");
	}

  _handleMinClick() {
    bridge.postMessage("app.min");
  }

  _handleMaxClick() {
    bridge.postMessage("app.max");
  }

  _handleQuitClick() {
    bridge.postMessage("app.quit");
  }

  render() {
    const { meta, children, ...props } = this.props;

    return (
      <HeaderComponent
        meta={meta}
        children={children}
        onMinClick={::this._handleMinClick}
        onMaxClick={::this._handleMaxClick}
        onQuitClick={::this._handleQuitClick}
        {...props}
      />
    );
  }
}

Header.propTypes = {
  meta: PropTypes.object.isRequired,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  meta: state.common.meta,
});

export default connect(mapStateToProps)(Header);
