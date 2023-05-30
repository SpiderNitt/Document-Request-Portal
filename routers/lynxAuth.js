const lAuthRouter = require("express").Router();
require("dotenv").config({ path: "../env/.env" });

const { createJWT } = require("../utils/jwt");
let grpc = require("@grpc/grpc-js");
let protoLoader = require("@grpc/proto-loader");
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

//const REMOTE_SERVER = "grpc.lcas.spider-nitt.org";
const PROTO_PATH = "utils/lynxAuth.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.authentication.Authentication(
  process.env.REMOTE_SERVER,
  grpc.credentials.createSsl()
);

lAuthRouter.post("/generateOtp", async (req, res) => {
  try {
    const { roll } = req.body;

    if (!roll) {
      return res.status(401).json({
        message: "Enter rollNumber properly",
      });
    }

    client.GenerateOTP(
      {
        clientID: process.env.GRPC_CLIENT_ID,
        clientSecret: process.env.GRPC_CLIENT_SECRET,
        rollNo: roll,
      },
      (error, message) => {
        if (!error) {
          return res.status(200).json({
            message: message.message,
          });
        } else {
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
                error
              });
          }
        }
      }
    );
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: "Server Error, Try again later.",
    });
  }
});

lAuthRouter.post("/verifyOtp", async (req, res) => {
  try {
    const { roll, otp } = req.body;

    if (!roll || !otp) {
      return res.status(400).json({
        message: "Fill all required fields",
      });
    }

    client.VerifyOTP(
      {
        clientID: process.env.GRPC_CLIENT_ID,
        clientSecret: process.env.GRPC_CLIENT_SECRET,
        rollNo: roll,
        otp: otp,
      },
      async (error, message) => {
        if (!error) {

          if (!roll)
            return res.status(401).json({
              message: "Unauthorized",
            });

          const rollNo = message.Details.fields.studentRoll.numberValue;
          
          console.log(rollNo);

          //student already exists
          const token = await createJWT(rollNo);
          return res.status(200).json({ message: "Success", token });
        } else {
          switch (error.code) {
            //invalid OTP
            case 16:
              return res.status(400).json({
                message: error.details,
              });
            case 13:
              return res.status(500).json({
                message: "Internal server Error, Try again later.",
              });
            //lynx account not found
            case 5:
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
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      message: "Server Error, Try again later.",
    });
  }
});

module.exports = lAuthRouter;