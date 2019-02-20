import { combineReducers } from 'redux';
import config from './config';
import project from './project';
import view from './view';

export default combineReducers({
  config,
  project,
  view,
});
