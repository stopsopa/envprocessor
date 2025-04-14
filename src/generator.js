import fs from "fs";

// const path = require("path");
import path from "path";

import template from "./template.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // or use path.dirname('')

const tmpFile = path.resolve(__dirname, "template.tmp");

const str = fs.readFileSync(tmpFile, "utf8");

const tmp = template(str);

/**
 * @param {import('./generatorArgs.js/index.js').Values} values
 * @param {import('./generatorArgs.js/index.js').Positionals} positionals
 * @returns {import('./types.js').GeneratorType}
 */
export default function generator(values, positionals) {
  return {
    script: tmp({
      v: values,
      p: positionals,
    }),
    command: ``,
  };
}
