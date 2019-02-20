import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { message } from 'antd';
import Moment from 'react-moment';
import AppComponent from '../components/App';
import { setMeta } from '../reducers/common/meta';

class App extends Component {
  constructor(props) {
    super(props);

    Moment.globalLocale = 'zh-cn';

    message.config({
      top: 100,
      duration: 2,
      maxCount: 5
    });
  }

  componentWillMount() {
    this._loadMeta();
  }

  _loadMeta() {
    const { dispatch } = this.props;
    bridge.postMessage("app.getMeta").then(meta => dispatch(setMeta(meta)));
  }

  render() {
    return (
      <AppComponent>
        {this.props.children}
      </AppComponent>
    )
  }
}

export default withRouter(connect()(App));
