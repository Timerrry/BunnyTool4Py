import update from 'immutability-helper';
import { uuid, stamp } from '../../lib/util';

const SET_BOARD = 'graph-project/set-board';
const SET_NAME = 'graph-project/set-name';
const SET_PROJECT = 'graph-project/set-project';
const SAVED_PROJECT = 'graph-project/saved-project';

const ADD_COMPONENT = 'graph-project/add-component';
const REMOVE_COMPONENT = 'graph-project/remove-component';
const REMOVE_ALL_COMPONENTS = 'graph-project/remove-all-components';
const UPDATE_COMPONENT = 'graph-project/update-component';
const SELECT_COMPONENT = 'graph-project/select-component';

const UPDATE_BLOCKLY = 'graph-project/update-blockly';

const DEFAULT_BOARD = "ArduinoUNO";
const DEFAULT_BLOCKLY_DOM = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';
const DEFAULT_BLOCKLY_CODE = 'void setup() {\n\n}\n\nvoid loop() {\n\n}\n';

const initState = {
  key: '',
  type: 'graph',
  name: '',
  author: '',
  board: '',
  components: [],
  createdAt: 0,
  updatedAt: 0,
  path: '',
  index: -1,
  blockly: {
    dom: DEFAULT_BLOCKLY_DOM,
    code: '',
  },
};

export default (state = initState, action) => {
  let index;
  let components;
  switch (action.type) {
    case SET_BOARD:
      return {...state, board: action.board};
    case SET_NAME:
      return {...state, name: action.name};
    case SET_PROJECT:
      return action.project;
    case SAVED_PROJECT:
      return {...state, updatedAt: action.updatedAt, path: action.path};
    case ADD_COMPONENT:
      components = update(state.components, {$push: [action.component]});
      index = components.length - 1;
      return {...state, components , index};
    case REMOVE_COMPONENT:
      index = state.components.indexOf(action.component);
      components = update(state.components, {$splice: [[index, 1]]});
      index = index > components.length - 1 ? components.length - 1 : index;
      return {...state, components, index};
    case UPDATE_COMPONENT:
      index = state.components.findIndex(component => component.uid === action.uid);
      return {...state, components: update(state.components, {[index]: {$merge: {...action.component}}})};
    case REMOVE_ALL_COMPONENTS:
      return {...state, components: [], index: -1};
    case SELECT_COMPONENT:
      return {...state, index: action.index};
    case UPDATE_BLOCKLY:
      return {...state, blockly: action.blockly};
    default:
      return state;
  }
};

export function setBoard(board) {
  return {
    type: SET_BOARD,
    board,
  };
}

export function setName(name) {
  return {
    type: SET_NAME,
    name,
  };
}

export function setProject(project) {
  return {
    type: SET_PROJECT,
    project: {...project, key: uuid()}
  };
}

export function newProject(name = 'project') {
  let now = stamp();
  return {
    type: SET_PROJECT,
    project: {
      key: uuid(),
      type: 'graph',
      name,
      author: "timmery",
      board: DEFAULT_BOARD,
      components: [],
      createdAt: now,
      updatedAt: now,
      path: '',
      index: -1,
      blockly: {dom: DEFAULT_BLOCKLY_DOM, code: DEFAULT_BLOCKLY_CODE},
    }
  };
}

export function savedProject(path, updatedAt) {
  return {
    type: SAVED_PROJECT,
    updatedAt: updatedAt || stamp(),
    path,
  };
}

export function addComponent(component) {
  return {
    type: ADD_COMPONENT,
    component,
  };
}

export function removeComponent(component) {
  return {
    type: REMOVE_COMPONENT,
    component,
  };
}

export function removeAllComponents() {
  return {
    type: REMOVE_ALL_COMPONENTS,
  };
}

export function updateComponent(uid, component) {
  return {
    type: UPDATE_COMPONENT,
    uid,
    component,
  };
}

export function selectComponent(index) {
  return {
    type: SELECT_COMPONENT,
    index,
  };
}

export function updateBlockly(blockly) {
  return {
    type: UPDATE_BLOCKLY,
    blockly,
  };
}
