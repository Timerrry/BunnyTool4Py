import update from 'immutability-helper';
import { uuid, stamp } from '../../lib/util';

const SET_BOARD = 'text-project/set-board';
const SET_NAME = 'text-project/set-name';
const SET_PROJECT = 'text-project/set-project';
const SAVED_PROJECT = 'text-project/saved-project';

const NEW_FILE = 'text-project/new-file';
const REMOVE_FILE = 'text-project/remove-file';
const UPDATE_FILE = 'text-project/update-file';
const SWITCH_FILE = 'text-project/switch-file';

const DEFAULT_BOARD = "ESP32";
const DEFAULT_CODE = "# TODO python\nprint('Hello, BunnyTools!')\n";
const DEFAULT_BOOT_CODE = "# TODO python\nprint('Hello, BunnyTools!')\n";
const DEFAULT_PYTHON_CODE = "# TODO python\nprint('Hello, BunnyTools!')\n";


export const EXT = {
  cpp: "cpp",
  python: "py",
  javascript: "js",
};

let count = 0;
const initState = {
  key: '',
  type: 'text',
  name: '',
  author: '',
  board: '',
  createdAt: 0,
  updatedAt: 0,
  files: [],
  index: -1,
  path: '',
};

export default (state = initState, action) => {
  let { files, index } = state;
  let currentFile = files[index];
  switch (action.type) {
    case SET_BOARD:
      return {...state, board: action.board};
    case SET_NAME:
      return {...state, name: action.name};
    case SET_PROJECT:
      return action.project;
    case SAVED_PROJECT:
      return {...state, updatedAt: action.updatedAt, path: action.path};
    case NEW_FILE:
      let language = action.language || "python";
      let content = action.content || `# TODO ${language}`;
      let newFile = {
        name: (action.name || `未命名${count === 0 ? "" : ("-" + count)}`) + `.${EXT[language]}`,
        content: content,
        language: language,
      }
      files = files.concat(newFile);
      count++;
      return {...state, files, index: files.length - 1};
    case REMOVE_FILE:
      files = files.filter(f => f !== action.file);
      index = currentFile === action.file ? files.length - 1 : files.indexOf(currentFile);
      return {...state, files, index};
    case UPDATE_FILE:
      files = update(files, {[action.index]: {$merge: {...action.file}}});
      return {...state, files};
    case SWITCH_FILE:
      index = action.index < files.length ? action.index : -1;
      return {...state, index};
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
      type: 'text',
      name,
      author: "timmery",
      board: DEFAULT_BOARD,
      files: [
        {
        name: 'main.py',
        content: DEFAULT_CODE,
        language: 'python',
        main: true,
      }
    ],
      createdAt: now,
      updatedAt: now,
      index: 0,
      path: '',
    }
  };
}

export function newPythonProject(name = 'pythonProject') {
  let now = stamp();
  return {
    type: SET_PROJECT,
    project: {
      key: uuid(),
      type: 'text',
      name,
      author: "timmery",
      board: DEFAULT_BOARD,
      files: [
        {
          name: 'main.py',
          content: DEFAULT_CODE,
          language: 'python',
          main: true,
        }
      ],
      createdAt: now,
      updatedAt: now,
      index: 0,
      path: '',
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

export function newFile(file) {
  return {
    type: NEW_FILE,
    ...file,
  };
}

export function removeFile(file) {
  return {
    type: REMOVE_FILE,
    file,
  };
}

export function switchFile(index) {
  return {
    type: SWITCH_FILE,
    index,
  };
}

export function updateFile(index, file) {
  return {
    type: UPDATE_FILE,
    index,
    file,
  };
}
