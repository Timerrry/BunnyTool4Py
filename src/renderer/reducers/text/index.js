import { combineReducers } from 'redux';

import editor from './editor';
import build from './build';
import config from './config';
import project from './project';
import libraryManager from './libraryManager';
import fileMenu from './fileMenu';

export default combineReducers({
  editor,
  build,
  fileMenu,
  config,
  project,
  libraryManager,
});
