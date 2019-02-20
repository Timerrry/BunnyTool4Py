const SET_LANGUAGE = 'setting/editor/set-language';
const SET_STYLE = 'setting/editor/set-style';
const SET_THEME = 'setting/editor/set-theme';
const SET_FONT_SIZE = 'setting/editor/set-font-size';
const SET_TAB_SIZE = 'setting/editor/set-tab-size';
const SET_LINE_HEIGHT = 'setting/editor/set-line-height';
const LOAD = 'setting/editor/load';

const initState = {
  theme: 'vs-dark',
  tabSize: 4,
  fontSize: 14,
  lineHeight: 20,
  language: "python",
  style: "Google",
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {...state, language: state.language};
    case SET_STYLE:
      return {...state, style: action.style};
    case SET_THEME:
      let theme = action.theme !== undefined ? action.theme : (state.theme === "vs" ? "vs-dark" : "vs");
      return {...state, theme};
    case SET_FONT_SIZE:
      return {...state, fontSize: action.fontSize};
    case SET_TAB_SIZE:
      return {...state, tabSize: action.tabSize};
    case SET_LINE_HEIGHT:
      return {...state, lineHeight: action.lineHeight};
    case LOAD:
      return action.editor;
    default:
      return state;
  }
};

export function setLanguage(language) {
  return {
    type: SET_LANGUAGE,
    language,
  };
}

export function setStyle(style) {
  return {
    type: SET_STYLE,
    style,
  };
}

export function setTheme(theme) {
  return {
    type: SET_THEME,
    theme,
  };
}

export function setFontSize(fontSize) {
  return {
    type: SET_FONT_SIZE,
    fontSize,
  };
}

export function setTabSize(tabSize) {
  return {
    type: SET_TAB_SIZE,
    tabSize,
  };
}

export function setLineHeight(lineHeight) {
  return {
    type: SET_LINE_HEIGHT,
    lineHeight,
  };
}

export function load(editor) {
  return {
    type: LOAD,
    editor,
  };
}
