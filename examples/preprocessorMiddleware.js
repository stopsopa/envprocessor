const { getThrow } = require("envprocessor/env.js");

const { pickEnvironmentVariables, produceFileContent } = require("envprocessor/preprocessor.js");

const mask = getThrow("EXPOSE_ENV_VARIABLES");

const envVarFiltered = pickEnvironmentVariables(mask, process.env);

const content = produceFileContent(envVarFiltered);

export default (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.send(content);
};
