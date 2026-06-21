const path = require("node:path");

const { loadWithMocks } = require("./loadWithMocks");

function createRequestModuleLoader(relativeModulePath) {
  return function loadRequestModule(requestUrlImpl) {
    return loadWithMocks(path.resolve(process.cwd(), relativeModulePath), {
      obsidian: {
        requestUrl: requestUrlImpl,
      },
    });
  };
}

module.exports = { createRequestModuleLoader };
