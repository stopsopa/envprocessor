import fs from "fs";

import path from "path";

import template from "./template.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // or use path.dirname('')

const tmpFile = path.resolve(__dirname, "template.tmp");

const str = fs.readFileSync(tmpFile, "utf8");

const tmp = template(str);

export default function generator<T, K>(values: T, positionals: K) {
  return {
    script: tmp({
      v: values,
      p: positionals,
    }),
    command: ``,
  };
}
