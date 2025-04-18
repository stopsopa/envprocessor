import fs from "fs";

import path from "path";

import template from "./template.js";

const __dirname = path.resolve();

const tmpFile = path.resolve(__dirname, "src", "template.tmp");

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
