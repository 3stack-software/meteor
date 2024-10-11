import { Meteor$wrapFn } from '../meteor/helpers.js';

let startupHooks = [];

export function Meteor$runStartup () {
  while (startupHooks != null && startupHooks.length) {
    const hook = startupHooks.shift();
    hook.call()
  }
  startupHooks = null;
}

export function Meteor$startup(callback) {
  callback = Meteor$wrapFn(callback);
  if (process.env.METEOR_PROFILE) {
    // Create a temporary error to capture the current stack trace.
    var error = new Error("Meteor.startup");

    // Capture the stack trace of the Meteor.startup call, excluding the
    // startup stack frame itself.
    Error.captureStackTrace(error, Meteor$startup);

    callback.stack = error.stack
      .split(/\n\s*/) // Split lines and remove leading whitespace.
      .slice(0, 2) // Only include the call site.
      .join(" ") // Collapse to one line.
      .replace(/^Error: /, ""); // Not really an Error per se.
  }

  if (startupHooks) {
    startupHooks.push(callback);
  } else {
    // We already started up. Just call it now.
    callback();
  }
}
