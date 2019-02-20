import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import routes from './routes';

export default ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      { routes }
    </ConnectedRouter>
  );
};
