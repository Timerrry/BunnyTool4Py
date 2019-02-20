import update from 'immutability-helper';

const SET_PORTS = 'graph-config/set-ports';
const SET_PORT = 'graph-config/set-port';
const SET_BOARDS = 'graph-config/set-boards';
const SET_COMPONENTS = 'graph-config/set-components';

const initState = {
  port: '',
  ports: [],
  boards: [],
  components: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_PORTS:
      let ports = action.ports;
      let port = ports.find(p => p.comName === state.port) ? state.port : (ports.length > 0 ? ports[0].comName : "");
      return {...state, ports, port};
    case SET_PORT:
      return {...state, port: action.port};
    case SET_BOARDS:
      return {...state, boards: action.boards};
    case SET_COMPONENTS:
      return {...state, components: action.components};
    default:
      return state;
  }
};

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

export function setBoards(boards) {
  return {
    type: SET_BOARDS,
    boards,
  };
}

export function setComponents(components) {
  return {
    type: SET_COMPONENTS,
    components,
  };
}
