// express extension: https://raw.githubusercontent.com/stopsopa/roderic/86495ef554314d388e7f6ef10ee4de6d12bcbcff/libs/express-extend-res.js?token=GHSAT0AAAAAACVQ4Q66S6J6DLZRVFB5DQLSZXEOC2Q

const path = require("path");

const express = require("express");

// https://stackoverflow.com/a/23613092
const serveIndex = require("serve-index");

const host = process.env.HOST;

const port = process.env.PORT;

const web = path.resolve(__dirname);

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.all("/", (req, res) => {
  res.redirect("/examples/index.html");
});

app.use(
  express.static(web, {
    // http://expressjs.com/en/resources/middleware/serve-static.html
    // maxAge: 60 * 60 * 24 * 1000 // in milliseconds
    maxAge: "356 days", // in milliseconds max-age=30758400
  }),
  serveIndex(web, {
    icons: true,
    view: "details",
    hidden: false, // Display hidden (dot) files. Defaults to false.
  }),
);

app.listen(port, host, () => {
  console.log(`\n 🌎  Server is running ` + `http://${host}:${port}\n`);
});
