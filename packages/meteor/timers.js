import { CurrentMethodInvocation } from 'meteor/ddp-client/common/environment.js';
import { Meteor } from './client_environment.js';

function withoutInvocation(f) {
  var invocation = CurrentMethodInvocation.get();
  if (invocation && invocation.isSimulation) {
    throw new Error("Can't set timers inside simulations");
  }

  return function () {
    CurrentMethodInvocation.withValue(null, f);
  };
}

function bindAndCatch(context, f) {
  return Meteor.bindEnvironment(withoutInvocation(f), context);
}

// Meteor.setTimeout and Meteor.setInterval callbacks scheduled
// inside a server method are not part of the method invocation and
// should clear out the CurrentMethodInvocation environment variable.

/**
 * @memberOf Meteor
 * @summary Call a function in the future after waiting for a specified delay.
 * @locus Anywhere
 * @param {Function} func The function to run
 * @param {Number} delay Number of milliseconds to wait before calling function
 */
export const Meteor$setTimeout = function (f, duration) {
  return setTimeout(bindAndCatch("setTimeout callback", f), duration);
};

/**
 * @memberOf Meteor
 * @summary Call a function repeatedly, with a time delay between calls.
 * @locus Anywhere
 * @param {Function} func The function to run
 * @param {Number} delay Number of milliseconds to wait between each function call.
 */
export const Meteor$setInterval = function (f, duration) {
  return setInterval(bindAndCatch("setInterval callback", f), duration);
};

/**
 * @memberOf Meteor
 * @summary Cancel a repeating function call scheduled by `Meteor.setInterval`.
 * @locus Anywhere
 * @param {Object} id The handle returned by `Meteor.setInterval`
 */
export const Meteor$clearInterval = function(x) {
  return clearInterval(x);
};

/**
 * @memberOf Meteor
 * @summary Cancel a function call scheduled by `Meteor.setTimeout`.
 * @locus Anywhere
 * @param {Object} id The handle returned by `Meteor.setTimeout`
 */
export const Meteor$clearTimeout = function(x) {
  return clearTimeout(x);
};

// XXX consider making this guarantee ordering of defer'd callbacks, like
// Tracker.afterFlush or Node's nextTick (in practice). Then tests can do:
//    callSomethingThatDefersSomeWork();
//    Meteor.defer(expect(somethingThatValidatesThatTheWorkHappened));

/**
 * @memberOf Meteor
 * @summary Defer execution of a function to run asynchronously in the background (similar to `Meteor.setTimeout(func, 0)`.
 * @locus Anywhere
 * @param {Function} func The function to run
 */
export const Meteor$defer = function (f) {
  Meteor._setImmediate(bindAndCatch("defer callback", f));
};
