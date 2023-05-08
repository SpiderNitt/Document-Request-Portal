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
const database = require("../database/database");
const responseMessages = require("../utils/responseHandle");
const pino = require("pino");
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: process.env.ENV === "DEV",
});

const { validateHuman } = require("../utils/helper");
//load protoClient
// let grpc = require("grpc");
// let protoLoader = require("@grpc/proto-loader");
// const options = {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// };

// const PROTO_PATH = "utils/lynxAuth.proto";

// const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
// const proto = grpc.loadPackageDefinition(packageDefinition);

// const client = new proto.authentication.Authentication(
//   process.env.LCA_URI,
//   //process.env.ENV != "DEV"?
//   grpc.credentials.createSsl()
//   //:grpc.credentials.createInsecure()
// );

login.post("/otp", validateHuman, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(401).json({
        message: "Enter roll Number/Username properly",
      });
    }
    if(isNaN(username)){
      const otp = generateOTP((digits = 6)).toString();

    let mailOptions = {
      from: process.env.EMAIL,
      to: `${username}@nitt.edu`,
      subject: "Document Requisition OTP",
      html: "The OTP for login is: <b>" + otp + "</b>",
    };

    let info = await otpTransporter.sendMail(mailOptions);
    logger.info("Mail sent to " + email + ". Message ID: " + info.messageId);
    await database.Admin.update(
      { otp },
      {
        where: {
          name:username,
        },
      }
    );
    return helper.responseHandle(200, responseMessages.OTP_SENT, res);
    }
    
    else {
      client.GenerateOTP(
        {
          clientID: process.env.GRPC_CLIENT_ID,
          clientSecret: process.env.GRPC_CLIENT_SECRET,
          rollNo: username,
        },
        (error, message) => {
          if (!error) {
            return res.status(200).json({
              message: message.message,
            });
          } else {
            //logger.error(error);
            switch (error.code) {
              case 13:
                return res.status(500).json({
                  message: "Internal server Error, Try again later.",
                });
              case 5:
                return res.status(404).json({
                  message: error.details,
                });
              case 7:
                return res.status(500).json({
                  message: "Authentication server Error, Try again later.",
                });
              case 16:
                return res.status(404).json({
                  message: error.details,
                });
            }
          }
        }
      );
    }
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      message: "Server Error, Try again later.",
    });
  }
});

login.post("/submit", validateHuman, async (req, res) => {
  try {
    const { username, otp } = req.body;

    if (!username) {
      return res.status(401).json({
        message: "Enter rollNumber properly",
      });
    }
    if (isNaN(username)) {
      adminData = await database.Admin.findOrCreate({
        where: {
          name: username,
        },
      });
      if (adminData) {
        adminDetails = helper.wrapper(adminData);
        if (adminDetails.otp == otp) {
          const token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 1 month
              data: { username },
            },
            process.env.JWT_SECRET
          );

          return res.status(200).json({
            message: "Success",
            token,
          });
        } else
          return helper.responseHandle(
            401,
            responseMessages.INVALID_CREDENTIALS,
            res
          );
      } else
        return helper.responseHandle(
          401,
          responseMessages.INVALID_CREDENTIALS,
          res
        );
    } else {
      client.VerifyOTP(
        {
          clientID: process.env.GRPC_CLIENT_ID,
          clientSecret: process.env.GRPC_CLIENT_SECRET,
          rollNo: username,
          otp: otp,
        },
        async (error, message) => {
          if (!error) {
            const name = message.Details.fields.studentName.stringValue;
            const department =
              message.Details.fields.studentDepartment.stringValue;

            studentData = await database.Student.findOrCreate({
              where: {
                name: username,
              },
            });

            const token = jwt.sign(
              {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 1 month
                data: { username },
              },
              process.env.JWT_SECRET
            );

            return res.status(200).json({
              message: message.message,
              token,
            });
          } else {
            //logger.error(error);
            switch (error.code) {
              case 13:
                return res.status(500).json({
                  message: "Internal server Error, Try again later.",
                });
              case 5:
                return res.status(404).json({
                  message: error.details,
                });
              case 16:
                return res.status(404).json({
                  message: error.details,
                });
              case 7:
                return res.status(500).json({
                  message: "Authentication server Error, Try again later.",
                });
            }
          }
        }
      );
    }
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      message: "Server Error, Try again later.",
    });
  }
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
    if (isNaN(username)) {
      adminData = await database.Admin.findOrCreate({
        where: {
          name: username,
        },
      });
    } else {
      studentData = await database.Student.findOrCreate({
        where: {
          name: username,
        },
      });
    }
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
