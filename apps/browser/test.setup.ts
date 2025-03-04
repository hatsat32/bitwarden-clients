// Add chrome storage api
const QUOTA_BYTES = 10;
const storage = {
  local: {
    set: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
    QUOTA_BYTES,
    getBytesInUse: jest.fn(),
    clear: jest.fn(),
  },
  session: {
    set: jest.fn(),
    get: jest.fn(),
    has: jest.fn(),
    remove: jest.fn(),
  },
};

const runtime = {
  onMessage: {
    addListener: jest.fn(),
  },
  sendMessage: jest.fn(),
  getManifest: jest.fn(),
  getURL: jest.fn((path) => `chrome-extension://id/${path}`),
};

const contextMenus = {
  create: jest.fn(),
  removeAll: jest.fn(),
};

const i18n = {
  getMessage: jest.fn(),
};

const tabs = {
  executeScript: jest.fn(),
  sendMessage: jest.fn(),
  query: jest.fn(),
};

const scripting = {
  executeScript: jest.fn(),
};

const windows = {
  create: jest.fn(),
  get: jest.fn(),
  getCurrent: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// set chrome
global.chrome = {
  i18n,
  storage,
  runtime,
  contextMenus,
  tabs,
  scripting,
  windows,
} as any;
