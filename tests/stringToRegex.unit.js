// const stringToRegex = require("../src/source/stringToRegex.js");
import stringToRegex from "../src/source/stringToRegex.js";

function d(regex) {
  return {
    flags: regex.flags,
    source: regex.source,
    str: regex.toString(),
  };
}

function e(regex) {
  return expect(d(regex));
}

it("stringToRegex basic", async () => {
  const r = stringToRegex("/abc/i");

  // console.log(JSON.stringify(d(r), null, 4));

  e(r).toEqual({
    flags: "i",
    source: "abc",
    str: "/abc/i",
  });
});

it("stringToRegex slash", async () => {
  const r = stringToRegex("/abc\\/abcf/i");

  // console.log(JSON.stringify(d(r), null, 4));

  e(r).toEqual({
    flags: "i",
    source: "abc\\/abcf",
    str: "/abc\\/abcf/i",
  });
});

it("stringToRegex simple error", async () => {
  expect(() => stringToRegex("/abc/def/i")).toThrow(
    "stringToRegex error: general error: string '/abc/def/i' error: Error: param '/abc/def/i' should split to one or two segments",
  );
});

it("stringToRegex no flags", async () => {
  const r = stringToRegex("/abc/");

  // console.log(JSON.stringify(d(r), null, 4));

  e(r).toEqual({
    flags: "",
    source: "abc",
    str: "/abc/",
  });
});

it("stringToRegex just string", async () => {
  const r = stringToRegex("abc");

  // console.log(JSON.stringify(d(r), null, 4));

  e(r).toEqual({
    flags: "",
    source: "abc",
    str: "/abc/",
  });
});

it("stringToRegex slash before", async () => {
  const r = stringToRegex("/abc");

  // console.log(JSON.stringify(d(r), null, 4));

  e(r).toEqual({
    flags: "",
    source: "abc",
    str: "/abc/",
  });
});

it("stringToRegex slash after", async () => {
  const r = stringToRegex("abc/");

  // console.log(JSON.stringify(d(r), null, 4));

  e(r).toEqual({
    flags: "",
    source: "abc",
    str: "/abc/",
  });
});

it("stringToRegex slash", async () => {
  const r = stringToRegex("/\\/(CameraRoll|Screenshot|Videos)\\//");
  // const r = stringToRegex('/[\\d+]abc/i');

  // console.log(JSON.stringify(d(r), null, 4));

  e(r).toEqual({
    flags: "",
    source: "\\/(CameraRoll|Screenshot|Videos)\\/",
    str: "/\\/(CameraRoll|Screenshot|Videos)\\//",
  });
});

it("stringToRegex slash with flag", async () => {
  const r = stringToRegex("/\\/(CameraRoll|Screenshot|Videos)\\//is");
  // const r = stringToRegex('/[\\d+]abc/i');

  // console.log(JSON.stringify(d(r), null, 4));

  e(r).toEqual({
    flags: "is",
    source: "\\/(CameraRoll|Screenshot|Videos)\\/",
    str: "/\\/(CameraRoll|Screenshot|Videos)\\//is",
  });
});

it("stringToRegex slash at the end", async () => {
  // const r = stringToRegex('/\\/(CameraRoll|Screenshot|Videos)\\/');
  const r = stringToRegex("/abc\\//i");

  // console.log(JSON.stringify(d(r), null, 4));

  e(r).toEqual({
    flags: "i",
    source: "abc\\/",
    str: "/abc\\//i",
  });
});
