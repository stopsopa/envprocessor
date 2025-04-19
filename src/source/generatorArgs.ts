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

export type OptionsType = typeof options;

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

export type ValuesType = typeof values;
export type PositionalsType = typeof positionals;

export { options, values, positionals };
