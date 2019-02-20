const SET = 'setting/version/set';

const initState = "";

export default (state = initState, action) => {
  switch (action.type) {
    case SET:
      return action.version;
    default:
      return state;
  }
};

export function setVersion(version) {
  return {
    type: SET,
    version,
  };
}
