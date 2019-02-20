import update from 'immutability-helper';

const SET_EXAMPLES = 'text-config/set-examples';
const SET_BOARDS = 'text-config/set-boards';
const SET_LIBRARIES = 'text-config/set-libraries';
const UPDATE_LIBRARY = 'text-config/update-library';
const SET_PORTS = 'text-config/set-ports';
const SET_FILELIST = 'text-config/set-filelist';
const SET_PORT = 'text-config/set-port';
const SET_PORTID = 'text-config/set-portid';
const TOGGLE_SHOW_ERROR = 'text-config/toggle-show-error';

const maxRecentProjects = 10;

const initState = {
  examples: [],
  boards: [],
  libraries: [],
  ports: [],
  filelist: [],
  port: '',
  showError: true,
  portid: 0,
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_EXAMPLES:
      return {...state, examples: action.examples};
    case SET_BOARDS:
      return {...state, boards: action.boards};
    case SET_LIBRARIES:
      return {...state, libraries: action.libraries};
    case UPDATE_LIBRARY:
      let index = state.libraries.findIndex(l => l.name === action.library.name)
      let libraries = update(state.libraries, {[index]: {$set: action.library}});
      return {...state, libraries}
    case SET_PORTS:
      let ports = action.ports;
      let port = ports.find(p => p.comName === state.port) ? state.port : (ports.length > 0 ? ports[0].comName : "");
      return {...state, ports, port};
    case SET_FILELIST:
      let filelist = action.filelist;
      // let file = filelist.find(p => p.comName === state.file) ? state.file : (filelist.length > 0 ? filelist[0].comName : "");
      return {...state, filelist};
    case SET_PORT:
      return {...state, port: action.port};
    case SET_PORTID:
      return {...state, portid: action.portid};
    case TOGGLE_SHOW_ERROR:
      let showError = action.showError === undefined ? !state.showError : !!action.showError;
      return {...state, showError};
    default:
      return state;
  }
};

export function setExamples(examples) {
  return {
    type: SET_EXAMPLES,
    examples,
  };
}

export function setBoards(boards) {
  return {
    type: SET_BOARDS,
    boards,
  };
}

export function setLibraries(libraries) {
  return {
    type: SET_LIBRARIES,
    libraries,
  };
}

export function updateLibrary(library) {
  return {
    type: UPDATE_LIBRARY,
    library,
  };
}

export function setPorts(ports) {
  return {
    type: SET_PORTS,
    ports,
  };
}

export function setPort(port) {
  return {
    type: SET_PORT,
    port,
  }
}

export function toggleShowError(showError) {
  return {
    type: TOGGLE_SHOW_ERROR,
    showError,
  }
}

export function setFileList(filelist) {
  return {
    type: SET_FILELIST,
    filelist,
  }
}

export function setPortId(portid) {
  return {
    type: SET_PORTID,
    portid,
  }
}
