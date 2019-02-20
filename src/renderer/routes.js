import React from 'react';
import { Route, Switch } from 'react-router';

import App from './containers/App';
import Home from './containers/home/Index';
import Text from './containers/text/Index';
import Graph from './containers/graph/Index';

export default (
  <App>
    <Switch>
      <Route exact path="/" component={Text} />
      <Route exact path="/text" component={Text} />
      <Route exact path="/graph" component={Graph} />
    </Switch>
  </App>
);
