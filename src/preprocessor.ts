import path from "path";

import fs from "fs";

import stringToRegex from "./stringToRegex.js";

import isObject from "./isObject.js";

import { mkdirp } from "mkdirp";

import packageJson from "../package.json" with { type: "json" };

export function th(msg: string): Error {
  return new Error(`preprocessor.js error: ${msg}`);
}

/**
 * object, and space goes straight to JSON.stringify,
 * but indentExceptFirstLine is to add additional indentation to all lines except the first one.
 *
 * Needed for proper formatting of processed file for the browser.
 */
export function serializeInPrettierCompatibleWay(object: any, space = 2, indentExceptFirstLine = 2): string {
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
 */
export function findWidestKeyLen(obj: Record<string, any>): number {
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
 */
export function presentExtractedVariables(obj: Record<string, any>, indent = 2): string {
  const max = findWidestKeyLen(obj) + 1;

  let buffer: string[] = [];

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
 */
export function produceFileContent(
  obj: Record<string, string>,
  template: (obj: Record<string, string>) => string = function (obj) {
    return `window.process = {
  env: ${serializeInPrettierCompatibleWay(obj, 2, 2)}
};
`;
  },
): string {
  return template(obj);
}

/**
 * Dumps given object to the file after processing with produceFileContent()
 */
export function saveToFile(file: string, content: string): void {
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
 */
export function produceRegex(mask: string | RegExp): RegExp {
  let reg: RegExp;

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
export function pickEnvironmentVariables(mask: string | RegExp, obj: Record<string, string>): Record<string, string> {
  const reg = produceRegex(mask);

  return (Object.keys(obj) as string[]).reduce(
    (acc, key) => {
      if (reg.test(key)) {
        acc[key] = obj[key];
      }

      return acc;
    },
    {} as Record<string, string>,
  );
}

/**
 * Returns the credit string with package name and version
 * @returns {string}
 */
export function getCredit() {
  return `${packageJson.name} v${packageJson.version}`;
}

/**
 * Creates a debug string with environment variables and generated files
 */
export function debugString(envVarFiltered: Record<string, string>, files: string[]): string {
  if (!isObject(envVarFiltered)) {
    throw th("debugString: envVarFiltered should be an object");
  }

  if (!Array.isArray(files)) {
    throw th("debugString: files should be an array");
  }

  const list = files.length > 0 ? files.map((file) => `    - ${file}`).join("\n") : "    none";

  return `
  Browser exposed environment variables:
  
${presentExtractedVariables(envVarFiltered, 4)}

  Generated files:

${list}
`;
}

/**
 * Creates a debug string with environment variables and generated files
 */
export function debugJson(envVarFiltered: Record<string, string>, files: string[]): Record<string, unknown> {
  if (!isObject(envVarFiltered)) {
    throw th("debugJson: envVarFiltered should be an object");
  }

  if (!Array.isArray(files)) {
    throw th("debugJson: files should be an array");
  }

  if (files.length === 0) {
    throw th("debugJson: files should contain at least one file");
  }

  return {
    credit: getCredit(),
    envVarFiltered,
    files,
  };
}
