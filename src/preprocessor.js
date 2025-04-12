const path = require("path");

const fs = require("fs");

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

function presentExtractedVariables(obj) {
  const max = findWidestKeyLen(obj);

  // log("Web exposed environment variables:");

  let buffer = [];

  Object.keys(obj).map((key) => {
    const l = key.length;

    let k = key;

    if (l < max) {
      k += " ".repeat(max - l);
    }

    buffer.push(`    ${k}: '${obj[key]}'`);
  });

  return buffer.join("\n");
}

function returnProcessed(obj) {
  return `window.process = {
  env: ${serializeInPrettierCompatibleWay(obj)}
};
`;
}

function saveToFile(file, obj) {
  // log(`Saving ${file}`);

  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }

  fs.writeFileSync(file, returnProcessed(obj));

  if (!fs.existsSync(file)) {
    throw th(`File '${file}' creation failed`);
  }
}

module.exports = {
  serializeInPrettierCompatibleWay,
  presentExtractedVariables,
  returnProcessed,
  saveToFile,
  findWidestKeyLen,
  log,
  th,
};
