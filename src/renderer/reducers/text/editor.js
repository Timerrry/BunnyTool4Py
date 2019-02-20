const SET_EDITOR = 'text-editor/set-editor';

const initState = null;

export default (state = initState, action) => {
  switch (action.type) {
    case SET_EDITOR:
      return action.editor;
    default:
      return state;
  }
};

export function setEditor(editor) {
  return {
    type: SET_EDITOR,
    editor,
  };
}
