(function() {
  const {ipcRenderer, webFrame} = require('electron');
  const Q = require('q');

  webFrame.setZoomFactor(1);
  webFrame.setVisualZoomLevelLimits(1, 1);
  webFrame.setLayoutZoomLevelLimits(0, 0);
  window.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

  function postMessage(name, ...args) {
    let deferred = Q.defer();

    let handler;
    handler = (e, type, ...rest) => {
      let callback = type === "notify" ? deferred.notify : (type ? deferred.resolve : deferred.reject);
      callback.apply(this, rest);
      type !== "notify" && ipcRenderer.removeListener(name, handler);
    }
    ipcRenderer.on(name, handler);
    ipcRenderer.send.apply(this, [name, ...args]);

    return deferred.promise;
  }

  let handlerMap = {};

  function listenMessage(name, handler) {
    let handlers = handlerMap[name];
    if(!handlers) {
      handlers = [];
      handlerMap[name] = handlers;
      ipcRenderer.on(name, (e, args) => {
        let list = handlerMap[name];
        list && list.forEach(h => h.apply(this, args));
      });
    }
    handlers.push(handler);
  }

  function unlistenMessage(name, handler) {
    let handlers = handlerMap[name];
    if(!handlers) {
      return;
    }

    if(handler !== true) {
      let index = handlers.indexOf(handler);
      if(index >= 0) {
        handlers.splice(index, 1);
      }
    }

    if(handler === true || handlers.length === 0) {
      delete handlerMap[name];
      ipcRenderer.removeAllListeners(name);
    }
  }

  function unlistenAllMessage() {
    Object.keys(handlerMap).forEach(name => ipcRenderer.removeAllListeners(name));
    handlerMap = {};
  }

  window.bridge = {
    postMessage,
    listenMessage,
    unlistenMessage,
    unlistenAllMessage,
  };
})();
