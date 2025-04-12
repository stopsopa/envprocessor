const path = require("path");

const fs = require("fs");

const stringToRegex = require("./stringToRegex.js");

const { mkdirp } = require("mkdirp");

function log(...args) {
  console.log(`preprocessor.js log: `, ...args);
}

function th(msg) {
  return new Error(`preprocessor.js error: ${msg}`);
}

function serializeInPrettierCompatibleWay(object) {
  const tmp = [];
  Object.entries(object).forEach(([key, value]) => {
    const _key = JSON.stringify(key, false);
    const _value = JSON.stringify(value, true);
    tmp.push(`  ${_key}: ${_value}`);
  });

  if (tmp.length > 0) {
    return `{
  ${tmp.join(",\n  ")}
  }`;
  }
  return `{}`;
}

function findWidestKeyLen(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const l = key.length;

    if (l > acc) {
      return l;
    }

    return acc;
  }, 0);
}

function presentExtractedVariables(obj, indent = 2) {
  const max = findWidestKeyLen(obj) + 1;

  // log("Web exposed environment variables:");

  let buffer = [];

  Object.keys(obj).map((key) => {
    const l = key.length;

    let k = key;

    if (l < max) {
      k += " ".repeat(max - l);
    }

    buffer.push(`${k}: '${obj[key]}'`);
  });

  const s = " ".repeat(indent);

  return s + buffer.join("\n" + s);
}

function produceFileContent(obj) {
  return `window.process = {
  env: ${serializeInPrettierCompatibleWay(obj)}
};
`;
}
/**
 * Dumps given object to the file after processing with produceFileContent()
 * @param {string} file
 * @param {object} obj
 */
function saveToFile(file, obj) {
  // log(`Saving ${file}`);

  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }

  fs.writeFileSync(file, produceFileContent(obj));

  if (!fs.existsSync(file)) {
    throw th(`File '${file}' creation failed`);
  }
}

/**
 * Doing what it cane to convert mask to RegExp, if it is already a RegExp, it will be returned as is.
 * @param {string|RegExp} mask
 * @returns RegExp
 */
function produceRegex(mask) {
  let reg;

  if (typeof mask === "string") {
    if (mask.includes("$")) {
      throw th(`mask should not containe '$' character, replace it with <dollar> tag instead`);
    }

    reg = stringToRegex(mask.replace(/<dollar>/g, "$"));
  } else {
    reg = mask;
  }

  return reg;
}

/**
 * Extract subset of environment variables from given object.
 * @param {string|RegExp} mask - Environment variable not matching to the mask will be abandoned.
 * @param {object} obj - Usually you will pass process.env here
 * @returns Record<string, string>
 */
function pickEnvironmentVariables(mask, obj) {
  const reg = produceRegex(mask);

  return Object.keys(obj).reduce((acc, key) => {
    if (reg.test(key)) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

module.exports = {
  serializeInPrettierCompatibleWay,
  produceRegex,
  presentExtractedVariables,
  pickEnvironmentVariables,
  produceFileContent,
  saveToFile,
  findWidestKeyLen,
  log,
  th,
};
