const path = require("path");

const fs = require("fs");

const stringToRegex = require("./stringToRegex.js");

const isObject = require("./isObject.js");

const { mkdirp } = require("mkdirp");

/**
 * @param {string} msg
 * @returns {Error}
 */
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
 * @param {number} [indentExceptFirstLine]
 * @returns {string}
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

/**
 * Finds the length of the widest key in an object
 * @param {Record<string, any>} obj
 * @returns {number}
 */
function findWidestKeyLen(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const l = key.length;

    if (l > acc) {
      return l;
    }

    return acc;
  }, 0);
}

/**
 * Formats extracted environment variables for display
 * @param {Record<string, string>} obj
 * @param {number} [indent]
 * @returns {string}
 */
function presentExtractedVariables(obj, indent = 2) {
  const max = findWidestKeyLen(obj) + 1;

  /**
   * @type {string[]}
   */
  let buffer = [];

  Object.keys(obj).map((key) => {
    const l = key.length;

    const k = `${key}${" ".repeat(max - l)}`;

    buffer.push(`${k}: '${obj[key]}'`);
  });

  const s = " ".repeat(indent);

  return s + buffer.join("\n" + s);
}

/**
 * Produces file content with environment variables
 * @param {Record<string, string>} obj
 * @param {function(Record<string, string>): string} [template]
 * @returns {string}
 */
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
 * @param {string} file - Path to the file
 * @param {string} content - Content to write to the file
 * @returns {void}
 */
function saveToFile(file, content) {
  if (typeof content !== "string") {
    throw th("saveToFile: content should be a string");
  }

  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }

  fs.writeFileSync(file, content);

  if (!fs.existsSync(file)) {
    throw th(`File '${file}' creation failed`);
  }
}

/**
 * Doing what it can to convert mask to RegExp, if it is already a RegExp, it will be returned as is.
 * @param {string|RegExp} mask
 * @returns {RegExp}
 */
function produceRegex(mask) {
  /**
   * @type {RegExp}
   */
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
 * Extract subset of environment variables from given wider set.
 * @param {string|RegExp} mask - Environment variable not matching to the mask will be abandoned.
 * @param {Record<string, string>} obj - Usually you will pass process.env here
 * @returns {Record<string, string>}
 */
function pickEnvironmentVariables(mask, obj) {
  const reg = produceRegex(mask);

  return Object.keys(obj).reduce(
    /**
     * @param {Record<string, string>} acc - Accumulator object
     * @param {string} key - Current key being processed
     * @returns {Record<string, string>}
     */
    (acc, key) => {
      if (reg.test(key)) {
        acc[key] = obj[key];
      }

      return acc;
    },
    {},
  );
}

const packageJson = require("../package.json");

/**
 * Returns the credit string with package name and version
 * @returns {string}
 */
function getCredit() {
  return `${packageJson.name} v${packageJson.version}`;
}

/**
 * Creates a debug string with environment variables and generated files
 * @param {Record<string, string>} envVarFiltered
 * @param {string[]} files
 * @returns {string}
 */
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
