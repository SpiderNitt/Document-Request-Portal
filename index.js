require("dotenv").config({ path: "./env/.env" });

const express = require("express");
// const morgan = require('morgan')
const cors = require("cors");
const path = require("path");
global.appRoot = path.resolve(__dirname);

const pino = require("pino");
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: process.env.ENV === "DEV",
});

const app = express();
const port = process.env.PORT || 3001;

const fs = require("fs");

const apiRouter = require("./routers/api");
const loginRouter = require("./routers/login");
const alumniRouter = require("./routers/alumni");


const { exit } = require("process");

app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));
// app.use(express.static("public/build"));

app.use("/api", apiRouter);
app.use("/login", loginRouter);
app.use("/alumni", alumniRouter);


// app.use(function (req, res) {
//   res.sendFile("public/build/index.html", { root: __dirname });
// });

try {
  fs.mkdirSync(__dirname + "/temp");
  fs.mkdirSync(__dirname + "/uploads");
  fs.mkdirSync(__dirname + "/sign");
} catch (err) {
  // catch all errors ectory already exist (EEXIST)
  if (err.code !== "EEXIST") {
    console.log(err);
    exit();
  }
}
app.listen(port, function () {
  logger.info("Server running on port %d", port);
});
