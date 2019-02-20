const SET_STATUS_MESSAGE = "text-build/set-status-message";
const SET_BUILD_MESSAGE = "text-build/set-build-message";
const SET_BUILD_AND_UPLOAD_LOCK = "text-build/set-build-and-upload-lock";
const SET_BUILD_ERROR = "text-build/set-build-error";

const initState = {
  statusMessage: '',
  buildMessage: '',
  buildAndUploadLock: false,
  buildError: null,
};

export default (state = initState, action) => {
  switch (action.type) {
    case SET_STATUS_MESSAGE:
      return {...state, statusMessage: action.statusMessage};
    case SET_BUILD_MESSAGE:
      return {...state, buildMessage: action.buildMessage};
    case SET_BUILD_AND_UPLOAD_LOCK:
      return {...state, buildAndUploadLock: action.buildAndUploadLock};
    case SET_BUILD_ERROR:
      return {...state, buildError: action.buildError};
    default:
      return state;
  }
};

export function setStatusMessage(message) {
  return {
    type: SET_STATUS_MESSAGE,
    statusMessage: message,
  }
}

export function setBuildMessage(message) {
  return {
    type: SET_BUILD_MESSAGE,
    buildMessage: message,
  }
}

export function setBuildAndUploadLock(lock) {
  return {
    type: SET_BUILD_AND_UPLOAD_LOCK,
    buildAndUploadLock: lock,
  }
}

export function setBuildError(error) {
  return {
    type: SET_BUILD_ERROR,
    buildError: error,
  }
}
