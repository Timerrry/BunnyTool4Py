const TOGGLE = 'text-file-menu/toggle';
const TOGGLE_FILELIST = 'text-file-menu/togglefilelist';
const SWITCH_TAB = 'text-file-menu/switch-tab';
const CLOSE_FILELIST = "text-file-menu/closefilelist";

const initState = {
  visible: false,
  show: undefined,
  tab: "recent",
};

export default (state = initState, action) => {
  switch (action.type) {
    case TOGGLE:
      let visible = action.visible === undefined ? !state.visible : !!action.visible;
      return {...state, visible};
    case TOGGLE_FILELIST:
      let show = action.show === undefined ? !state.show : !!action.show;
      return {...state, show: action.show};
    case SWITCH_TAB:
      return {...state, tab: action.tab};
    case CLOSE_FILELIST:
        return {...state, undefined};
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

export function switchTab(tab) {
  return {
    type: SWITCH_TAB,
    tab,
  };
}

export function toggleFilelist(show) {
  return {
    type: TOGGLE_FILELIST,
    show,
  };
}

export function closeFileList() {
  let show = undefined;
   return {
    type: TOGGLE_FILELIST,
       show,
  };
}
