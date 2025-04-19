//                                                                      nlab/isObject    lodash/isObject
// ✓ lodash.isObject - {}                                                    -> true  -> true (3 ms)
// ✓ lodash.isObject - Plain object                                          -> true  -> true (1 ms)
// ✓ lodash.isObject - new function () {}                                    -> true  -> true
// ✓ lodash.isObject - using with object that have implemented toString()    -> true  -> true (1 ms)
// ✓ lodash.isObject - extended object                                       -> true  -> true (1 ms)
// ✓ lodash.isObject - []                                                    -> false -> true
// ✓ lodash.isObject - null                                                  -> false -> false
// ✓ lodash.isObject - function () {}                                        -> false -> true
// ✓ lodash.isObject - async function () {}                                  -> false -> true (1 ms)
// ✓ lodash.isObject - () => {}                                              -> false -> true
// ✓ lodash.isObject - true                                                  -> false -> false
// ✓ lodash.isObject - false                                                 -> false -> false (1 ms)
// ✓ lodash.isObject - NaN                                                   -> false -> false
// ✓ lodash.isObject - undefined                                             -> false -> false (1 ms)
// ✓ lodash.isObject - no arg                                                -> false -> false
// ✓ lodash.isObject - 4                                                     -> false -> false
// ✓ lodash.isObject - string                                                -> false -> false
// ✓ lodash.isObject - Symbol('test')                                        -> false -> false
// ✓ lodash.isObject - new Date()                                            -> false -> true (1 ms)
// ✓ lodash.isObject - new Map()                                             -> false -> true
// ✓ lodash.isObject - new Set()                                             -> false -> true
// ✓ lodash.isObject - new Error()                                           -> false -> true

// Cu -> custom
// const isObjectCu = require("../src/source/isObject.js");
import isObjectCu from "../src/source/isObject.js";

const isObjectLo = () => {};
function expelo() {
  return {
    toBeTruthy: () => {},
    toBeFalsy: () => {},
  };
}

// const isObjectLo = require('lodash/isObject');
// function expelo(data) {
//   return expect(data);
// }

it("lodash.isObject - {}                                                    -> true  -> true", async () => {
  expect(isObjectCu({})).toBeTruthy();
  expelo(isObjectLo({})).toBeTruthy();
});

it("lodash.isObject - Plain object                                          -> true  -> true", async () => {
  expect(isObjectCu(Object.create(null))).toBeTruthy();
  expelo(isObjectLo(Object.create(null))).toBeTruthy();
});

it("lodash.isObject - new function () {}                                    -> true  -> true", async () => {
  expect(isObjectCu(new (function () {})())).toBeTruthy();
  expelo(isObjectLo(new (function () {})())).toBeTruthy();
});

it("lodash.isObject - using with object that have implemented toString()    -> true  -> true", async () => {
  var k = function () {};
  k.prototype.toString = function () {
    return "test...";
  };

  var t = new k();

  expect(t + "").toEqual("test...");

  expect(isObjectCu(t)).toBeTruthy();
  expelo(isObjectLo(t)).toBeTruthy();
});

it("lodash.isObject - extended object                                       -> true  -> true", async () => {
  var a = function () {};

  var b = function () {};

  b.prototype = Object.create(a.prototype);

  b.prototype.constructor = b;

  expect(isObjectCu(new b())).toBeTruthy();
  expelo(isObjectLo(new b())).toBeTruthy();
});

it("lodash.isObject - []                                                    -> false -> true", async () => {
  expect(isObjectCu([])).toBeFalsy();
  expelo(isObjectLo([])).toBeTruthy();
});

it("lodash.isObject - null                                                  -> false -> false", async () => {
  expect(isObjectCu(null)).toBeFalsy();
  expelo(isObjectLo(null)).toBeFalsy();
});

it("lodash.isObject - function () {}                                        -> false -> true", async () => {
  expect(isObjectCu(function () {})).toBeFalsy();
  expelo(isObjectLo(function () {})).toBeTruthy();
});

it("lodash.isObject - async function () {}                                  -> false -> true", async () => {
  expect(isObjectCu(async function () {})).toBeFalsy();
  expelo(isObjectLo(async function () {})).toBeTruthy();
});

it("lodash.isObject - () => {}                                              -> false -> true", async () => {
  expect(isObjectCu(() => {})).toBeFalsy();
  expelo(isObjectLo(() => {})).toBeTruthy();
});

it("lodash.isObject - true                                                  -> false -> false", async () => {
  expect(isObjectCu(true)).toBeFalsy();
  expelo(isObjectLo(true)).toBeFalsy();
});

it("lodash.isObject - false                                                 -> false -> false", async () => {
  expect(isObjectCu(false)).toBeFalsy();
  expelo(isObjectLo(false)).toBeFalsy();
});

it("lodash.isObject - NaN                                                   -> false -> false", async () => {
  expect(isObjectCu(NaN)).toBeFalsy();
  expelo(isObjectLo(NaN)).toBeFalsy();
});

it("lodash.isObject - undefined                                             -> false -> false", async () => {
  expect(isObjectCu(undefined)).toBeFalsy();
  expelo(isObjectLo(undefined)).toBeFalsy();
});

it("lodash.isObject - no arg                                                -> false -> false", async () => {
  expect(isObjectCu()).toBeFalsy();
  expelo(isObjectLo()).toBeFalsy();
});

it("lodash.isObject - 4                                                     -> false -> false", async () => {
  expect(isObjectCu(4)).toBeFalsy();
  expelo(isObjectLo(4)).toBeFalsy();
});

it("lodash.isObject - string                                                -> false -> false", async () => {
  expect(isObjectCu("test")).toBeFalsy();
  expelo(isObjectLo("test")).toBeFalsy();
});

it("lodash.isObject - Symbol('test')                                        -> false -> false", async () => {
  expect(isObjectCu(Symbol("test"))).toBeFalsy();
  expelo(isObjectLo(Symbol("test"))).toBeFalsy();
});

it("lodash.isObject - new Date()                                            -> false -> true", async () => {
  expect(isObjectCu(new Date())).toBeFalsy();
  expelo(isObjectLo(new Date())).toBeTruthy();
});

it("lodash.isObject - new Map()                                             -> false -> true", async () => {
  expect(isObjectCu(new Map())).toBeFalsy();
  expelo(isObjectLo(new Map())).toBeTruthy();
});

it("lodash.isObject - new Set()                                             -> false -> true", async () => {
  expect(isObjectCu(new Set())).toBeFalsy();
  expelo(isObjectLo(new Set())).toBeTruthy();
});

it("lodash.isObject - new Error()                                           -> false -> true", async () => {
  expect(isObjectCu(new Error())).toBeFalsy();
  expelo(isObjectLo(new Error())).toBeTruthy();
});
