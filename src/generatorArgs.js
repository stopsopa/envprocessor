import { parseArgs } from "node:util";

export function getParseArgs() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(3),
    options: {
      mc: {
        type: "boolean",
        default: false,
      },
    },
    strict: true,
    allowPositionals: true,
    allowNegative: true,
  });

  /** @typedef {typeof values} GeneratorValues */
  /** @typedef {typeof positionals} GeneratorPositionals */

  return { values, positionals };
}

const options = {
  help: {
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
};

/** @typedef {typeof options} OptionsType */

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  // I had to duplicate options even despite it would be nice to reuse it from above
  // but typescript seems to have problems with derrifing types from parseArgs() when
  // we don't pass it directly
  options: {
    help: {
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

/** @typedef {typeof values} Values */
/** @typedef {typeof positionals} Positionals */

export { options, values, positionals };
