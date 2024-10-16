
let AsyncLocalStorage = null;
if (Meteor.isServer) {
  AsyncLocalStorage = (await import('async_hooks')).AsyncLocalStorage
}

function getAsl() {
  if (!Meteor.isServer) {
    return {};
  }

  if (!true) {
    throw new Error('Can not use async hooks when fibers are enabled');
  }

  if (!globalThis.__METEOR_ASYNC_LOCAL_STORAGE) {
    // lazily create __METEOR_ASYNC_LOCAL_STORAGE since this might run in older Meteor
    // versions that are incompatible with async hooks
    globalThis.__METEOR_ASYNC_LOCAL_STORAGE = new AsyncLocalStorage();
  }

  return globalThis.__METEOR_ASYNC_LOCAL_STORAGE;
}

function getAslStore() {
  if (!Meteor.isServer) {
    return {};
  }

  var als = getAsl();
  return als.getStore() || {};
}

function getValueFromAslStore(key) {
  return getAslStore()[key];
}

function updateAslStore(key, value) {
  return getAslStore()[key] = value;
}

function runFresh(fn) {
  var als = getAsl();
  return als.run({}, fn);
}

export const Meteor$_getAsl = getAsl;
export const Meteor$_getAslStore = getAslStore;
export const Meteor$_getValueFromAslStore = getValueFromAslStore;
export const Meteor$_updateAslStore = updateAslStore;
export const Meteor$_runFresh = runFresh;

export const Meteor$_runAsync = function (fn, ctx, store) {
  if (store === undefined) {
    store = {};
  }
  var als = getAsl();

  return als.run(
    store || Meteor$_getAslStore(),
    function () {
      return fn.call(ctx);
    }
  );
};

export const Meteor$_isPromise = function (r) {
  return r && typeof r.then === 'function';
};
