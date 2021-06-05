const webmail_auth_url = "https://spider.nitt.edu/~praveen/auth_json.php";

const axios = require("axios");
const jwt = require("jsonwebtoken");
const login = require("express").Router();
const helper = require("../utils/helper");
const admin_allowlist = [
  "abcspider",
  "defspider",
  "ghispider",
  "jklspider",
  "mnospider",
];
const responseMessages = require("../utils/responseHandle");
const pino = require("pino");
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: process.env.ENV === "DEV",
});

login.post("/", async function (req, res) {
  const { username, password } = req.body;
  const data = {
    rollno: username,
    password,
  };
  let flag = false;
  // If DEV env or allowList in PROD
  if (
    process.env.ENV == "DEV" ||
    (process.env.ENV == "PROD" && admin_allowlist.includes(username))
  ) {
    flag = true;
  } else {
    let response = await axios.post(webmail_auth_url, data);
    if (response.status / 100 != 2) {
      return helper.responseHandle(500, responseMessages.UPSTREAM_FAILURE, res);
    }

    if (response.data == 1) {
      flag = true;
    }
  }

  if (flag) {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 1 month
        data: { username },
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ message: "Success", token });
  } else {
    return helper.responseHandle(
      401,
      responseMessages.INVALID_CREDENTIALS,
      res
    );
  }
});

module.exports = login;
