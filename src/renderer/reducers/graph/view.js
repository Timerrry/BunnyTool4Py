const TOGGLE_BOARD_EXPAND = 'graph-view/toggle-board-expand';
const TOGGLE_LIST_EXPAND = 'graph-view/toggle-list-expand';
const TOGGLE_FULLSCREEN = 'graph-view/toggle-fullscreen';

const TOGGLE_RIGHT_TAB = 'graph-view/toggle-right-tab';
const SWITCH_RIGHT_TAB = 'graph-view/switch-right-tab';
const RIGHT_TAB_RESIZE = "graph-view/resize-right-tab";
const SET_EDITOR = "graph-view/set-editor";

const initState = {
  boardExpand: false,
  listExpand: true,
  fullscreen: false,
  rightTab: {
    tab: "component-detail", // "component-detail"、"code-view"
    active: true,
    width: 400,
  },
  editor: null,
};

export default (state = initState, action) => {
  switch (action.type) {
    case TOGGLE_BOARD_EXPAND:
      let boardExpand = action.expand === undefined ? !state.boardExpand : !!action.expand;
      return {...state, boardExpand};
    case TOGGLE_LIST_EXPAND:
      let listExpand = action.expand === undefined ? !state.listExpand : !!action.expand;
      return {...state, listExpand};
    case TOGGLE_FULLSCREEN:
      let fullscreen = action.fullscreen === undefined ? !state.fullscreen : !!action.fullscreen;
      return {...state, fullscreen};
    case TOGGLE_RIGHT_TAB:
      let active = action.active === undefined ? !state.rightTab.active : !!action.active;
      return {...state, rightTab: {...state.rightTab, active}};
    case SWITCH_RIGHT_TAB:
      return {...state, rightTab: {...state.rightTab, tab: action.tab}};
    case RIGHT_TAB_RESIZE:
      return {...state, rightTab: {...state.rightTab, width: action.width}};
    case SET_EDITOR:
      return {...state, editor: action.editor};
    default:
      return state;
  }
};

export function toggleBoardExpand(expand) {
  return {
    type: TOGGLE_BOARD_EXPAND,
    expand,
  };
}

export function toggleListExpand(expand) {
  return {
    type: TOGGLE_LIST_EXPAND,
    expand,
  };
}

export function toggleFullscreen(fullscreen) {
  return {
    type: TOGGLE_FULLSCREEN,
    fullscreen,
  };
}

export function toggleRightTab(active) {
  return {
    type: TOGGLE_RIGHT_TAB,
    active,
  };
}

export function switchRightTab(tab) {
  return {
    type: SWITCH_RIGHT_TAB,
    tab,
  };
}

export function resizeRightTab(width) {
  return {
    type: RIGHT_TAB_RESIZE,
    width,
  };
}

export function setEditor(editor) {
  return {
    type: SET_EDITOR,
    editor,
  };
}
