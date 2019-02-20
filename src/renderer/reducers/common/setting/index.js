import { combineReducers } from 'redux';
import editor from './editor';
import recentProjects from './recentProjects';
import version from './version';

export default combineReducers({
  editor,
  recentProjects,
  version,
});
