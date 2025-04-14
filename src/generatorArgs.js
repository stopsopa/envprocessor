import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  args: process.argv.slice(3),
  options: {
    mc: {
      // more control
      type: "boolean",
      default: false,
    },
    debug: {
      type: "boolean",
      default: false,
    },
    verbose: {
      type: "boolean",
      default: false,
    },
    dryrun: {
      type: "boolean",
      default: false,
    },
    verboseEnv: {
      type: "string",
    },

    mask: {
      type: "string",
    },
    maskEnv: {
      type: "string",
    },

    enrichModule: {
      type: "string",
    },

    enrichModuleEnv: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
  allowNegative: true,
});

/**
 * This file exists mainly to generate this set of types
 * and to make it available for use in generator.js
 */
/** @typedef {typeof values} Values */
/** @typedef {typeof positionals} Positionals */

export default {
  values,
  positionals,
};
