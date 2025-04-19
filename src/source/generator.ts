import fs from "fs";

import path from "path";

import template from "./template.js";

import { getRootDirname } from "./paths.js";

const _root = getRootDirname();

const _filename = path.resolve(_root, "..", "..", "src", "source", "template.tmp");

const str = fs.readFileSync(_filename, "utf8");

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
