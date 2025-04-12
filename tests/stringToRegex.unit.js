const stringToRegex = require("../src/stringToRegex.js");

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

it("stringToRegex basic", (done) => {
  try {
    const r = stringToRegex("/abc/i");

    // console.log(JSON.stringify(d(r), null, 4));

    e(r).toEqual({
      flags: "i",
      source: "abc",
      str: "/abc/i",
    });

    done();
  } catch (e) {
    done(String(e));
  }
});

it("stringToRegex slash", (done) => {
  try {
    const r = stringToRegex("/abc\\/abcf/i");

    // console.log(JSON.stringify(d(r), null, 4));

    e(r).toEqual({
      flags: "i",
      source: "abc\\/abcf",
      str: "/abc\\/abcf/i",
    });

    done();
  } catch (e) {
    done(String(e));
  }
});

it("stringToRegex simple error", (done) => {
  try {
    const r = stringToRegex("/abc/def/i");

    // console.log(JSON.stringify(d(r), null, 4));

    done("error");
  } catch (e) {
    expect(String(e)).toEqual(
      "Error: stringToRegex error: general error: string '/abc/def/i' error: Error: param '/abc/def/i' splits to more than 2 segments",
    );

    done();
  }
});

it("stringToRegex no flags", (done) => {
  try {
    const r = stringToRegex("/abc/");

    // console.log(JSON.stringify(d(r), null, 4));

    e(r).toEqual({
      flags: "",
      source: "abc",
      str: "/abc/",
    });

    done();
  } catch (e) {
    done(String(e));
  }
});

it("stringToRegex just string", (done) => {
  try {
    const r = stringToRegex("abc");

    // console.log(JSON.stringify(d(r), null, 4));

    e(r).toEqual({
      flags: "",
      source: "abc",
      str: "/abc/",
    });

    done();
  } catch (e) {
    done(String(e));
  }
});

it("stringToRegex slash before", (done) => {
  try {
    const r = stringToRegex("/abc");

    // console.log(JSON.stringify(d(r), null, 4));

    e(r).toEqual({
      flags: "",
      source: "abc",
      str: "/abc/",
    });

    done();
  } catch (e) {
    done(String(e));
  }
});

it("stringToRegex slash after", (done) => {
  try {
    const r = stringToRegex("abc/");

    // console.log(JSON.stringify(d(r), null, 4));

    e(r).toEqual({
      flags: "",
      source: "abc",
      str: "/abc/",
    });

    done();
  } catch (e) {
    done(String(e));
  }
});

it("stringToRegex slash", (done) => {
  try {
    const r = stringToRegex("/\\/(CameraRoll|Screenshot|Videos)\\//");
    // const r = stringToRegex('/[\\d+]abc/i');

    // console.log(JSON.stringify(d(r), null, 4));

    e(r).toEqual({
      flags: "",
      source: "\\/(CameraRoll|Screenshot|Videos)\\/",
      str: "/\\/(CameraRoll|Screenshot|Videos)\\//",
    });

    done();
  } catch (e) {
    done(String(e));
  }
});

it("stringToRegex slash with flag", (done) => {
  try {
    const r = stringToRegex("/\\/(CameraRoll|Screenshot|Videos)\\//is");
    // const r = stringToRegex('/[\\d+]abc/i');

    // console.log(JSON.stringify(d(r), null, 4));

    e(r).toEqual({
      flags: "is",
      source: "\\/(CameraRoll|Screenshot|Videos)\\/",
      str: "/\\/(CameraRoll|Screenshot|Videos)\\//is",
    });

    done();
  } catch (e) {
    done(String(e));
  }
});

it("stringToRegex slash at the end", (done) => {
  try {
    // const r = stringToRegex('/\\/(CameraRoll|Screenshot|Videos)\\/');
    const r = stringToRegex("/abc\\//i");

    // console.log(JSON.stringify(d(r), null, 4));

    e(r).toEqual({
      flags: "i",
      source: "abc\\/",
      str: "/abc\\//i",
    });

    done();
  } catch (e) {
    done(String(e));
  }
});
