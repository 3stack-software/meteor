import { Promise as Promise$1 } from '#meteor-promise';

const Meteor$wrapFn = function (fn) {
  if (!fn || typeof fn !== 'function') {
    throw new Error('Expected to receive function to wrap');
  }

  if (typeof Promise$1.await === 'function') {
    return function () {
      var ret = fn.apply(this, arguments);
      if (ret && typeof ret.then === 'function') {
        return Promise$1.await(ret);
      }

      return ret;
    };
  } else {
    return fn;
  }
};

export { Meteor$wrapFn };
