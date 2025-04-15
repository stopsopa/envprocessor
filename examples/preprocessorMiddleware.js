const { getThrow } = require("envprocessor");

const { pickEnvironmentVariables, produceFileContent } = require("envprocessor/preprocessor.js");

const mask = getThrow("ENVPROCESSOR_EXPOSE_ENV_VARS");

const envVarFiltered = pickEnvironmentVariables(mask, process.env);

const content = produceFileContent(envVarFiltered);

export default (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.send(content);
};
