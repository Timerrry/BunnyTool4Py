import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { connectRouter } from 'connected-react-router';

import App from './App';
import { configureStore, history } from './store/configureStore';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'

const store = configureStore();

const render = Root => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Root history={history} />
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => render(require('./App'))); // eslint-disable-line global-require
  module.hot.accept('./reducers/index', () => store.replaceReducer(connectRouter(history)(require('./reducers/index')))); // eslint-disable-line global-require
}
