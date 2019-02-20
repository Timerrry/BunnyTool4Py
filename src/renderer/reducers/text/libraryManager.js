const TOGGLE = 'text-library-manager/toggle';
const RESIZE = "text-library-manager/resize";

const initState = {
  visible: false,
  height: 450,
};

export default (state = initState, action) => {
  switch (action.type) {
    case TOGGLE:
      let visible = action.visible === undefined ? !state.visible : !!action.visible;
      return {...state, visible};
    case RESIZE:
      return {...state, height: action.height};
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

export function resize(height) {
  return {
    type: RESIZE,
    height,
  }
}
