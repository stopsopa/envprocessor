/**
 * Possible variants to run:
 *   EXPOSE_EXTRA_ENV_VARIABLES="^TERM" node examples/generate-debugManual.js
 *   EXPOSE_EXTRA_ENV_VARIABLES="^TERM" VERBOSE=true node examples/generate-debugManual.js
 */

const { getThrow, get } = require("envprocessor/env.js");

const {
  saveToFile,
  presentExtractedVariables,
  pickEnvironmentVariables,
  getCredit,
} = require("envprocessor/preprocessor.js");

const mask = getThrow("EXPOSE_EXTRA_ENV_VARIABLES");

const envVarFiltered = pickEnvironmentVariables(mask, process.env);

const files = ["var/preprocessed.js", "var/deep/directory/preprocessed.js"];

files.forEach((file) => {
  saveToFile(file, envVarFiltered);
});

if (get("VERBOSE")) {
  console.log(`
${getCredit()}

  Browser exposed environment variables:
  
${presentExtractedVariables(envVarFiltered, 4)}

  Generated files:

${files.map((file) => `    - ${file}`).join("\n")}
`);
}
