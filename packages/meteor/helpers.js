
/**
 * @summary `Meteor.release` is a string containing the name of the [release](#meteorupdate) with which the project was built (for example, `"1.2.3"`). It is `undefined` if the project was built using a git checkout of Meteor.
 * @locus Anywhere
 * @type {String}
 */
export const Meteor$release = __meteor_runtime_config__.meteorRelease;

// XXX find a better home for these? Ideally they would be _.get,
// _.ensure, _.delete..

// _get(a,b,c,d) returns a[b][c][d], or else undefined if a[b] or
// a[b][c] doesn't exist.
//
export const Meteor$_get = function (obj /*, arguments */) {
  for (var i = 1; i < arguments.length; i++) {
    if (!(arguments[i] in obj))
      return undefined;
    obj = obj[arguments[i]];
  }
  return obj;
};

// _ensure(a,b,c,d) ensures that a[b][c][d] exists. If it does not,
// it is created and set to {}. Either way, it is returned.
//
export const Meteor$_ensure = function (obj /*, arguments */) {
  for (var i = 1; i < arguments.length; i++) {
    var key = arguments[i];
    if (!(key in obj))
      obj[key] = {};
    obj = obj[key];
  }

  return obj;
};

// _delete(a, b, c, d) deletes a[b][c][d], then a[b][c] unless it
// isn't empty, then a[b] unless it isn't empty.
//
export const Meteor$_delete = function (obj /*, arguments */) {
  var stack = [obj];
  var leaf = true;
  for (var i = 1; i < arguments.length - 1; i++) {
    var key = arguments[i];
    if (!(key in obj)) {
      leaf = false;
      break;
    }
    obj = obj[key];
    if (typeof obj !== "object")
      break;
    stack.push(obj);
  }

  for (var i = stack.length - 1; i >= 0; i--) {
    var key = arguments[i+1];

    if (leaf)
      leaf = false;
    else
      for (var other in stack[i][key])
        return; // not empty -- we're done

    delete stack[i][key];
  }
};


/**
 * @memberOf Meteor
 * @locus Anywhere
 * @summary Takes a function that has a callback argument as the last one and promissify it.
 * One option would be to use node utils.promisify, but it won't work on the browser.
 * @param {Function} fn
 * @param {Object} [context]
 * @param {Boolean} [errorFirst] - If the callback follows the errorFirst style, default to true
 * @returns {function(...[*]): Promise<unknown>}
 */
export const Meteor$promisify = function (fn, context, errorFirst) {
  if (errorFirst === undefined) {
    errorFirst = true;
  }

  return function () {
    var self = this;
    var filteredArgs = Array.prototype.slice.call(arguments)
      .filter(function (i) { return i !== undefined; });

    return new Promise(function (resolve, reject) {
      var callback = Meteor.bindEnvironment(function (error, result) {
        var _error = error, _result = result;
        if (!errorFirst) {
          _error = result;
          _result = error;
        }

        if (_error) {
          return reject(_error);
        }

        resolve(_result);
      });

      filteredArgs.push(callback);

      return fn.apply(context || self, filteredArgs);
    });
  };
};


export const Meteor$wrapFn = function (fn) {
  return fn;
};

// Sets child's prototype to a new object whose prototype is parent's
// prototype. Used as:
//   Meteor._inherits(ClassB, ClassA).
//   _.extend(ClassB.prototype, { ... })
// Inspired by CoffeeScript's `extend` and Google Closure's `goog.inherits`.
var hasOwn = Object.prototype.hasOwnProperty;
export const Meteor$_inherits = function (Child, Parent) {
  // copy Parent static properties
  for (var key in Parent) {
    // make sure we only copy hasOwnProperty properties vs. prototype
    // properties
    if (hasOwn.call(Parent, key)) {
      Child[key] = Parent[key];
    }
  }

  // a middle member of prototype chain: takes the prototype from the Parent
  var Middle = function () {
    this.constructor = Child;
  };
  Middle.prototype = Parent.prototype;
  Child.prototype = new Middle();
  Child.__super__ = Parent.prototype;
  return Child;
};

var warnedAboutWrapAsync = false;

/**
 * @deprecated in 0.9.3
 */
export const Meteor$_wrapAsync = function(fn, context) {
  if (! warnedAboutWrapAsync) {
    Meteor._debug("Meteor._wrapAsync has been renamed to Meteor.wrapAsync");
    warnedAboutWrapAsync = true;
  }
  return Meteor$wrapAsync(fn, context);
};

function logErr(err) {
  if (err) {
    return Meteor._debug(
      "Exception in callback of async function",
      err
    );
  }
}
