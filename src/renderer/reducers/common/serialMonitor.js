const TOGGLE = 'common-serial-monitor/toggle';
const RESIZE = "common-serial-monitor/resize";
const SET_LINE_ENDING = "common-serial-monitor/set-line-ending";
const SET_BAUDRATE = "common-serial-monitor/set-baudrate";
const TOGGLE_AUTO_SCROLL = "common-serial-monitor/toggle-auto-scroll";

const initState = {
  visible: false,
  height: 450,
  lineEnding: 'raw',
  baudrate: 9600,
  autoScroll: true,
};

export default (state = initState, action) => {
  switch (action.type) {
    case TOGGLE:
      let visible = action.visible === undefined ? !state.visible : !!action.visible;
      return {...state, visible};
    case TOGGLE_AUTO_SCROLL:
      let autoScroll = action.autoScroll === undefined ? !state.autoScroll : !!action.autoScroll;
      return {...state, autoScroll};
    case RESIZE:
      return {...state, height: action.height};
    case SET_LINE_ENDING:
      return {...state, lineEnding: action.lineEnding};
    case SET_BAUDRATE:
      return {...state, baudrate: action.baudrate};
    default:
      return state;
  }
};

export function toggle(visible) {
  return {
    type: TOGGLE,
    visible,
  };
}

export function toggleAutoScroll(autoScroll) {
  return {
    type: TOGGLE_AUTO_SCROLL,
    autoScroll,
  };
}

export function resize(height) {
  return {
    type: RESIZE,
    height,
  }
}

export function setLineEnding(lineEnding) {
  return {
    type: SET_LINE_ENDING,
    lineEnding,
  }
}

export function setBaudrate(baudrate) {
  return {
    type: SET_BAUDRATE,
    baudrate,
  }
}
