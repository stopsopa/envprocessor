const path = require("path");

const fs = require("fs");

const stringToRegex = require("./stringToRegex.js");

const isObject = require("./isObject.js");

const { mkdirp } = require("mkdirp");

function th(msg) {
  return new Error(`preprocessor.js error: ${msg}`);
}

/**
 * object, and space goes straight to JSON.stringify,
 * but indentExceptFirstLine is to add additional indentation to all lines except the first one.
 *
 * Needed for proper formatting of processed file for the browser.
 * @param {any} object
 * @param {string | number} [space]
 * @returns
 */
function serializeInPrettierCompatibleWay(object, space = 2, indentExceptFirstLine = 2) {
  if (Object.keys(object).length === 0) {
    return "{}";
  }

  const str = JSON.stringify(object, null, space)
    .split("\n")
    .map((line, i) => {
      if (i === 0) {
        return line;
      }

      return " ".repeat(indentExceptFirstLine) + line;
    })
    .join("\n");

  return str;
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

  let buffer = [];

  Object.keys(obj).map((key) => {
    const l = key.length;

    const k = `${key}${" ".repeat(max - l)}`;

    buffer.push(`${k}: '${obj[key]}'`);
  });

  const s = " ".repeat(indent);

  return s + buffer.join("\n" + s);
}

function produceFileContent(
  obj,
  template = function (obj) {
    return `window.process = {
  env: ${serializeInPrettierCompatibleWay(obj, 2, 2)}
};
`;
  },
) {
  return template(obj);
}
/**
 * Dumps given object to the file after processing with produceFileContent()
 * @param {string} file
 * @param {object} obj
 */
function saveToFile(file, obj) {
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

const packageJson = require("../package.json");

function getCredit() {
  return `${packageJson.name} v${packageJson.version}`;
}

function debugString(envVarFiltered, files) {
  if (!isObject(envVarFiltered)) {
    throw th("debugString: envVarFiltered should be an object");
  }

  if (!Array.isArray(files)) {
    throw th("debugString: files should be an array");
  }

  if (files.length === 0) {
    throw th("debugString: files should contain at least one file");
  }

  return `
${getCredit()}

  Browser exposed environment variables:
  
${presentExtractedVariables(envVarFiltered, 4)}

  Generated files:

${files.map((file) => `    - ${file}`).join("\n")}
`;
}

module.exports = {
  serializeInPrettierCompatibleWay,
  produceRegex,
  presentExtractedVariables,
  pickEnvironmentVariables,
  produceFileContent,
  saveToFile,
  findWidestKeyLen,
  getCredit,
  debugString,

  th,
};
