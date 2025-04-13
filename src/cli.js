/**
 * node src/cli.js --mask "/^TERM_.*<dollar>/gi" var/preprocessed.js var/deep/directory/preprocessed.js --verbose --debug
 *
 * -- specify mask via env var
 * ENVPROCESSOR_EXPOSE_ENV_VARS="/^TERM_.*<dollar>/gi" node src/cli.js --maskEnv ENVPROCESSOR_EXPOSE_ENV_VARS var/preprocessed.js var/deep/directory/preprocessed.js --verbose --debug
 *
 * -- specify verbose via env var
 * ENVPROCESSOR_VERBOSE="" node src/cli.js --mask "/^TERM_.*<dollar>/gi" var/preprocessed.js var/deep/directory/preprocessed.js --debug --verboseEnv ENVPROCESSOR_VERBOSE
 *
 * -- specify enrich module to add or process extracted env vars
 * node src/cli.js --mask "/^TERM_.*<dollar>/gi" var/preprocessed.js var/deep/directory/preprocessed.js --verbose --debug --enrichModule "./enrich.js"
 *
 * -- specify enrich module via env var
 * ENVPROCESSOR_ENRICH_MODULE="./enrich.js" node src/cli.js --mask "/^TERM_.*<dollar>/gi" var/preprocessed.js var/deep/directory/preprocessed.js --verbose --debug --enrichModuleEnv ENVPROCESSOR_ENRICH_MODULE
 */
const path = require("path");

const { parseArgs } = require("node:util");

const { getThrow, has } = require("./env.js");

const {
  saveToFile,
  produceRegex,
  pickEnvironmentVariables,
  produceFileContent,
  debugString,
  th,
} = require("./preprocessor.js");

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
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
 * @param {string} msg
 * @returns {string}
 */
function msg(msg) {
  return `envprocessor debug: ${msg}`;
}
/**
 * @param {string} mmsg
 * @returns {void}
 */
function log(mmsg) {
  console.log(msg(mmsg));
}

(async function () {
  if (values.help) {
    console.log(`

    Usage: node src/cli.js [options] [output files...]
    Options:
      --help              Show help
      --mask <pattern>    Specify a regex pattern to match environment variables 
      --maskEnv <var>     Specify an environment variable containing a regex pattern
      --enrichModule <module>  Specify a module to enrich the environment variables
      --enrichModuleEnv <var>  Specify an environment variable containing the enrich module path
      --debug             Enable debug mode (off by default)
      --verbose           Enable verbose mode (off by default)
    `);

    return;
  }

  const debug = values.debug;
  debug && log(`--debug mode is ${debug ? "enabled" : "disabled"}`);

  let mask;

  // handle --maskEnv "ENVPROCESSOR_EXPOSE_ENV_VARS"
  if (values.maskEnv) {
    debug && log(`--maskEnv argument given >${values.maskEnv}<`);

    mask = getThrow(values.maskEnv, msg(`fetching value of ${values.maskEnv} failed, env var is not defined`));

    debug && log(`extracted value >${mask}< from env var >${values.maskEnv}<`);
  } else {
    debug && log("--maskEnv argument is not defined");
  }

  // handle --mask "^TERM_"
  if (values.mask) {
    debug && log(`--mask argument given >${values.mask}<`);

    mask = values.mask;
  } else {
    debug && log("--mask argument is not defined");
  }

  if (typeof mask !== "string") {
    throw th(`mask was not defined, use either --maskEnv or --mask`);
  }

  debug && log(`final mask after transforming to regex is >${String(produceRegex(mask))}<`);

  // handle positionals arguments
  // don't throw in debug mode
  if (!debug) {
    if (!Array.isArray(positionals) || positionals.length === 0) {
      throw th(
        `at least one positionals argument must be defined to specify output file(s). Or specify --debug to skip this check for now to test rest of the configuration`,
      );
    }
  }
  const files = positionals;

  let verbose;

  // handle --verboseEnv ""
  if (values.verboseEnv) {
    debug && log(`--verboseEnv argument given >${values.verboseEnv}<`);

    verbose = has(values.verboseEnv);

    debug && log(`extracted value >${verbose}< from env var >${values.verboseEnv}<`);
  } else {
    debug && log("--verboseEnv argument is not defined");
  }
  // handle --verbose
  verbose = values.verbose;
  debug && log(`final --verbose mode is ${verbose ? "enabled" : "disabled"}`);

  let enrichModule = null;

  // handle --enrichModuleEnv "ENVPROCESSOR_ENRICH_MODULE"
  if (values.enrichModuleEnv) {
    debug && log(`--enrichModuleEnv argument given >${values.enrichModuleEnv}<`);

    enrichModule = getThrow(
      values.enrichModuleEnv,
      msg(`fetching value of ${values.enrichModuleEnv} failed, env var is not defined`),
    );

    debug && log(`extracted value >${enrichModule}< from env var >${values.enrichModuleEnv}<`);
  } else {
    debug && log("--enrichModuleEnv argument is not defined");
  }

  // handle --enrichModule "enrich.cjs"
  if (values.enrichModule) {
    debug && log(`--enrichModule argument given >${values.enrichModule}<`);

    enrichModule = values.enrichModule;
  } else {
    debug && log("--enrichModule argument is not defined");
  }

  debug && log(`final enrichModule is >${enrichModule}<`);

  // use mask to extract subset of env vars
  let envVarFiltered = pickEnvironmentVariables(mask, /** @type {Record<string, string>}*/ (process.env));

  if (enrichModule) {
    const enrichPath = path.resolve(process.cwd(), enrichModule);

    debug && log(`loading enrichModule from path >${enrichPath}<`);

    try {
      // Use dynamic import which works for both ESM and CommonJS modules
      const enrichImport = await import(enrichPath);
      // Get the default export (for ESM) or the module itself (for CommonJS)
      const enrich = enrichImport.default || enrichImport;

      if (typeof enrich !== "function") {
        throw th(`enrichModule >${enrichModule}< is not a function`);
      }

      envVarFiltered = await enrich(envVarFiltered);
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));

      throw th(`Failed to load or execute enrichModule: ${typedError.message}`);
    }
  }

  const content = produceFileContent(envVarFiltered);

  files.forEach((file) => {
    if (debug) {
      log(`saving file >${file}< - skipped due to --debug mode`);
    } else {
      // use saveToFile to save the file
      saveToFile(file, content);
    }
  });

  if (verbose) {
    console.log(debugString(envVarFiltered, files));
  }
})();
