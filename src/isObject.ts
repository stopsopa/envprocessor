// @doc https://github.com/stopsopa/nlab#isobject

// const a = function () {};
// a.prototype.other = 'other';
// const b = function (t) { this.id = t };
// b.prototype = Object.create(a.prototype);
// b.prototype.constructor = b;

// WARNING: above EXTENDED OBJECT is an object according to this test
// WARNING: array is not an object according to this
// to summarize:
// isObject([])                     -> false
// isObject(() => {})               -> false
// isObject(new b(1))               -> true     - better
// isObject(new function () {})     -> true
// isObject({})                     -> true
// ALSO WORTH TO MENTION:
// this function doesn't care if new b(1) has or not has 'toString' function implemented, so it's rather safe

//  ✓isObject - {}                                                  -> true
//  ✓isObject - Object.create(null)                                 -> true
//  ✓isObject - using with object that have implemented toString()  -> true
//  ✓isObject - extended object                                     -> true
//  ✓isObject - new function () {}                                  -> true
//  ✓isObject - []                                                  -> false
//  ✓isObject - function () {}                                      -> false
//  ✓isObject - () => {}                                            -> false
//  ✓isObject - null                                                -> false
//  ✓isObject - true                                                -> false
//  ✓isObject - false                                               -> false
//  ✓isObject - NaN                                                 -> false
//  ✓isObject - undefined                                           -> false
//  ✓isObject - no arg                                              -> false
//  ✓isObject - 4                                                   -> false
//  ✓isObject - string                                              -> false
//  ✓isObject - Symbol('test')                                      -> false
//  ✓isObject - new Date()                                          -> false
//  ✓isObject - new Map()                                           -> false
//  ✓isObject - new Set()                                           -> false
//  ✓isObject - new Error()                                         -> false

function isObject(o: any): boolean {
  return Object.prototype.toString.call(o) === "[object Object]";
}

export default isObject;
