/**
 * Possible variants to run:
 *   ENVPROCESSOR_EXPOSE_ENV_VARS="^TERM" node examples/generate-debugString.js
 *   ENVPROCESSOR_EXPOSE_ENV_VARS="^TERM" VERBOSE=true node examples/generate-debugString.js
 */
import { getThrow, has } from "envprocessor";

import { saveToFile, pickEnvironmentVariables, produceFileContent, debugString } from "envprocessor/preprocessor";

// Define a mask which can be used to extract subset from all environment variables
// whichever env var matches that regex it will be exposed to the browser
// Obviously be careful here
const mask = getThrow("ENVPROCESSOR_EXPOSE_ENV_VARS");

// use mask to extract subset of env vars
const envVarFiltered = pickEnvironmentVariables(mask, process.env as Record<string, string>);

const content = produceFileContent(envVarFiltered);

// btw you can add some calculated values to envVarFiltered for the browser
// that might be a value calculated on the flight based on server context/states
// One might call these "synthetic env vars"
// The same way when there will exist env vars on the server which will not be available in the browser
// you might have env vars only for browser context

// and here we can define list of places where final file should be saved
// might be more than one place if you need it
const files = ["var/preprocessed.js", "var/deep/directory/preprocessed.js"];

files.forEach((file) => {
  // use saveToFile to save the file
  saveToFile(file, content);
});

if (has("VERBOSE")) {
  console.log(debugString(envVarFiltered, files));
}
