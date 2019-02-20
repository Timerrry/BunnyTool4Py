const SET_META = 'common-app/set-meta';

const initState = {}

export default (state = initState, action) => {
  switch (action.type) {
    case SET_META:
      return action.meta;
    default:
      return state;
  }
};

export function setMeta(meta) {
  return {
    type: SET_META,
    meta,
  };
}
