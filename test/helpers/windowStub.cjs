function installImmediateWindow() {
  const originalWindow = global.window;
  global.window = {
    setTimeout(callback) {
      callback();
      return 1;
    },
    clearTimeout() {},
  };

  return function restoreWindow() {
    global.window = originalWindow;
  };
}

module.exports = { installImmediateWindow };
