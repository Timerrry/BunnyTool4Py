import { combineReducers } from 'redux';
import setting from './setting/index';
import serialMonitor from './serialMonitor';
import meta from './meta';

export default combineReducers({
  meta,
  setting,
  serialMonitor,
});
