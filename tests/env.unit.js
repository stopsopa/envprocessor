"use strict";

import {
  mockEnv,
  get,
  getDefault,
  getIntegerThrowInvalid,
  getIntegerDefault,
  getIntegerThrow,
  getThrow,
  getTrimmedThrow,
  getValidatedThrow,
  getDefaultIfInvalid,
  all,
} from "../src/source/env.ts";

try {
  jest.setTimeout(100);
} catch (e) {}

it("get - ABC -> DEF", async () => {
  mockEnv({
    ABC: "DEF",
  });

  expect(get("ABC")).toEqual("DEF");
  expect(get("GHI")).toEqual(undefined);
});

it("getDefault - ABC -> DEF", async () => {
  mockEnv({
    ABC: "DEF",
  });

  expect(getDefault("ABC", "GHI")).toEqual("DEF");
  expect(getDefault("GHI", "JKL")).toEqual("JKL");
});

it("getThrow - ABC -> DEF", async () => {
  mockEnv({
    ABC: "DEF",
  });

  expect(getThrow("ABC")).toEqual("DEF");
  expect(() => getThrow("GHI")).toThrowError("env.js: env var GHI is not defined");
});

it("getIntegerThrowInvalid - ABC -> 123", async () => {
  mockEnv({
    ABC: "123",
    ZZZ: "not a number",
    BIG: "90071992547409919007199254740991",
  });

  expect(getIntegerThrowInvalid("ABC")).toEqual(123);
  expect(getIntegerThrowInvalid("GHI")).toEqual(undefined);
  expect(() => getIntegerThrowInvalid("ZZZ")).toThrowError(
    "env.js: env var ZZZ is not a number. value >not a number<, doesn't match regex >/^-?\\d+$/<",
  );
  expect(() => getIntegerThrowInvalid("BIG")).toThrowError(
    "env.js: parseInt(90071992547409919007199254740991, 10) returned 9.007199254740992e+31, doesn't match regex >/^-?\\d+$/<",
  );
});

it("getIntegerDefault - ABC -> 123", async () => {
  mockEnv({
    ABC: "123",
    ZZZ: "not a number",
  });

  expect(getIntegerDefault("ABC", 456)).toEqual(123);
  expect(getIntegerDefault("GHI", 789)).toEqual(789);
  expect(getIntegerDefault("ZZZ", 789)).toEqual(789);
});

test("getIntegerThrow", async () => {
  mockEnv({
    ABC: "123",
    ZZZ: "not a number",
  });

  expect(getIntegerThrow("ABC")).toEqual(123);

  const data = {};

  try {
    getIntegerThrow("GHI");
  } catch (e) {
    data.throw = e.message;
  }

  try {
    getIntegerThrow("ZZZ");
  } catch (e) {
    data.throw2 = e.message;
  }

  expect(data).toEqual({
    throw: "env.js: env var GHI is not defined or is not a number",
    throw2: "env.js: env var ZZZ is not a number. value >not a number<, doesn't match regex >/^-?\\d+$/<",
  });
});

it("all - returns all environment variables", async () => {
  const mockEnvironment = {
    ABC: "DEF",
    XYZ: "123",
    TEST: "value",
  };

  mockEnv(mockEnvironment);

  expect(all()).toEqual(mockEnvironment);
  expect(all()).toBe(mockEnvironment); // Check that it returns the same object reference
});

it("getTrimmedThrow", async () => {
  mockEnv({
    ABC: "  DEF  ",
    EMPTY: "   ",
  });

  expect(getTrimmedThrow("ABC")).toEqual("DEF");
  expect(() => getTrimmedThrow("EMPTY")).toThrowError(
    "env.js: env var EMPTY is defined but it is an empty string after trimming",
  );
  expect(() => getTrimmedThrow("GHI")).toThrowError("env.js: env var GHI is not defined");
});

it("getValidatedThrow", async () => {
  mockEnv({
    ABC: "123",
    DEF: "abc",
  });

  expect(getValidatedThrow("ABC", /^\d+$/)).toEqual("123");
  expect(() => getValidatedThrow("DEF", /^\d+$/)).toThrowError(
    "env.js: env var DEF value >abc< does not match regex >/^\\d+$/<",
  );

  expect(getValidatedThrow("ABC", (v) => (v === "123" ? null : "must be 123"))).toEqual("123");
  expect(() => getValidatedThrow("DEF", (v) => (v === "123" ? null : "must be 123"))).toThrowError(
    "env.js: must be 123",
  );

  expect(() =>
    getValidatedThrow("ABC", () => {
      throw new Error("custom error");
    }),
  ).toThrowError("custom error");
});

it("getDefaultIfInvalid", async () => {
  mockEnv({
    ABC: "123",
    DEF: "abc",
  });

  expect(getDefaultIfInvalid("ABC", "fallback", /^\d+$/)).toEqual("123");
  expect(getDefaultIfInvalid("DEF", "fallback", /^\d+$/)).toEqual("fallback");
  expect(getDefaultIfInvalid("GHI", "fallback", /^\d+$/)).toEqual("fallback");

  expect(getDefaultIfInvalid("ABC", "fallback", (v) => (v === "123" ? null : "error"))).toEqual("123");
  expect(getDefaultIfInvalid("DEF", "fallback", (v) => (v === "123" ? null : "error"))).toEqual("fallback");

  expect(
    getDefaultIfInvalid("ABC", "fallback", () => {
      throw new Error("custom error");
    }),
  ).toEqual("fallback");

  expect(getDefaultIfInvalid("ABC", "fallback", () => undefined)).toEqual("123");
  expect(getDefaultIfInvalid("ABC", "fallback", () => true)).toEqual("fallback");
});


