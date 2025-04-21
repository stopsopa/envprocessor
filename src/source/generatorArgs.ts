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
    type: "boolean" as const,
    default: false,
  },
  debug: {
    type: "boolean" as const,
    default: false,
  },
  verbose: {
    type: "boolean" as const,
    default: false,
  },
  dryrun: {
    type: "boolean" as const,
    default: false,
  },
  verboseEnv: {
    type: "string" as const,
  },

  mask: {
    type: "string" as const,
  },
  maskEnv: {
    type: "string" as const,
  },

  enrichModule: {
    type: "string" as const,
  },

  enrichModuleEnv: {
    type: "string" as const,
  },
};

type OptionsType = typeof options;

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options,
  strict: true,
  allowPositionals: true,
  allowNegative: true,
});

type ValuesType = typeof values;
type PositionalsType = typeof positionals;

export { options, values, positionals, OptionsType, ValuesType, PositionalsType };
