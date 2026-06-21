const Module = require("module");
const path = require("node:path");

function loadWithMocks(modulePath, mocks) {
  const originalLoad = Module._load;
  const resolvedModulePath = path.isAbsolute(modulePath)
    ? modulePath
    : require.resolve(modulePath, { paths: [process.cwd()] });

  Module._load = function patchedLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request];
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    delete require.cache[resolvedModulePath];
    return require(resolvedModulePath);
  } finally {
    Module._load = originalLoad;
  }
}

module.exports = { loadWithMocks };
