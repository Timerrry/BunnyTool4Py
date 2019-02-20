const TOGGLE = 'text-file-menu/toggle';
const TOGGLE_FILELIST = 'text-file-menu/togglefilelist';
const SWITCH_TAB = 'text-file-menu/switch-tab';

const initState = {
  visible: false,
  show: false,
  tab: "recent",
};

export default (state = initState, action) => {
  switch (action.type) {
    case TOGGLE:
      let visible = action.visible === undefined ? !state.visible : !!action.visible;
      return {...state, visible};
    case TOGGLE_FILELIST:
      let show = action.show === undefined ? !state.show : !!action.show;
      return {...state, show};
    case SWITCH_TAB:
      return {...state, tab: action.tab};
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
