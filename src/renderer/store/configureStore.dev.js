import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/index';

const logger = createLogger({
  level: 'info',
  collapsed: true
});
const history = createHashHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, logger, router);

function configureStore(initialState) {
  return createStore(connectRouter(history)(rootReducer), initialState, enhancer);
}

export default { configureStore, history };
