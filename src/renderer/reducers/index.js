import { combineReducers } from 'redux';

import common from './common/index';
import text from './text/index';
import graph from './graph/index';

export default combineReducers({
  common,
  text,
  graph,
});
