export const isFunction = fn => typeof fn === 'function';

export const isObject = obj => obj !== null && typeof obj === 'object';

const baseIsArguments = item =>
  isObject(item) &&
  Object.prototype.toString.call(item) === '[object Arguments]';

export const isArguments = baseIsArguments(
  (function () {
    return arguments;
  })(),
)
  ? baseIsArguments
  : value => isObject(value) && typeof value.callee === 'function';

export function isPlainObject(o) {
  if (!isObject(o)) {
    return false;
  }
  const proto = Object.getPrototypeOf(o);
  return (
    proto === null ||
    proto === Object.prototype ||
    Object.getPrototypeOf(proto) === null
  );
}
