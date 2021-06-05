const jwt = require("jsonwebtoken");
const pino = require("pino");

const {
  validateOrdinaryMail,
  generateOTP,
  otpTransporter,
} = require("../utils/helper");
const database = require("../database/database");
const helpers = require("../utils/helper");
const responseMessages = require("../utils/responseHandle");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: process.env.ENV === "DEV",
});

const alumni = require("express").Router();

alumni.post("/register", async function (req, res) {
  try {
    let errors = {};
    let { name, roll_no, department, email, mobile } = req.body;

    if (!validateOrdinaryMail(email)) {
      errors.email = "Email is not valid";
    }

    if (!(helpers.validateRoll(roll_no) && roll_no.length == 9)) {
      errors.roll = "Roll number is not valid. Must consist of 9 digits.";
    }

    if (!(mobile.length >= 10)) {
      errors.mobile = "Phone number is not valid";
    }

    if (Object.keys(errors).length) {
      return helpers.responseHandle(
        400,
        responseMessages.INVALID_DATA,
        res,
        errors
      );
    }

    // check if email is already in db
    let email_exists = await database.Alumni.findOne({
      attributes: ["id", "email"],
      where: {
        email,
      },
    });

    if (email_exists) {
      return helpers.responseHandle(
        409,
        responseMessages.EMAIL_ALREADY_REGISTERED,
        res
      );
    }

    // Generate OTP
    const otp = generateOTP((digits = 6)).toString();
    let last_otp_sent = new Date(Date.now()).toISOString();

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Document Requisition OTP",
      html: "The OTP for login is: <b>" + otp + "</b>",
    };

    // TODO: SEND MAIL
    // let info = await otpTransporter.sendMail(mailOptions);
    // logger.info("Message ID: " + info.messageId)

    // PUT IN DATABASE
    await database.Alumni.create({
      name,
      roll_no,
      department,
      email,
      mobile,
      otp,
      last_otp_sent,
    });
    return helpers.responseHandle(200, responseMessages.ALUMNI_REGISTERED, res);
  } catch (err) {
    logger.error(err);
    return helpers.responseHandle(500, responseMessages.DEFAULT_500, res);
  }
});
alumni.post("/login", async function (req, res) {
  try {
    const { email } = req.body;
    let email_exists = await database.Alumni.findOne({
      attributes: ["id", "email"],
      where: {
        email,
      },
    });

    if (!email_exists) {
      return helpers.responseHandle(
        409,
        responseMessages.ALUMNI_EMAIL_NOT_EXIST,
        res
      );
    }
    const otp = generateOTP((digits = 6)).toString();
    let last_otp_sent = new Date(Date.now()).toISOString();

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Document Requisition OTP",
      html: "The OTP for login is: <b>" + otp + "</b>",
    };

    // TODO: SEND MAIL
    // let info = await otpTransporter.sendMail(mailOptions);
    // logger.info("Message ID: " + info.messageId)

    // UPDATE IN DATABASE
    await database.Alumni.update(
      { otp, last_otp_sent },
      {
        where: {
          email,
        },
      }
    );
    return helpers.responseHandle(200, responseMessages.OTP_SENT, res);
  } catch (err) {
    logger.error(err);
    return helpers.responseHandle(500, responseMessages.DEFAULT_500, res);
  }
  // Check
});

alumni.post("/verify_otp", async function (req, res) {
  try {
    let { email, received_otp } = req.body;
    let email_exists = await database.Alumni.findOne({
      attributes: ["id", "email"],
      where: {
        email,
      },
    });

    if (!email_exists) {
      return helpers.responseHandle(
        400,
        responseMessages.ALUMNI_EMAIL_NOT_EXIST,
        res
      );
    }
    let row = await database.Alumni.findOne({
      attributes: ["otp"],
      where: {
        email,
      },
    });
    let { otp } = helpers.wrapper(row);

    if (otp === received_otp) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 1 month
          data: { email },
        },
        process.env.JWT_SECRET
      );
      let last_login = new Date(Date.now()).toISOString();
      await database.Alumni.update(
        {
          last_login,
          otp: generateOTP((digits = 10)),
        },
        {
          where: {
            email,
          },
        }
      );

      res.status(200).json({ success: true, message: "Success", token });
      return;
    } else {
      return helpers.responseHandle(401, responseMessages.INVALID_OTP, res);
    }
  } catch (err) {
    logger.error(err);
    return helpers.responseHandle(500, responseMessages.DEFAULT_500, res);
  }
});

alumni.post("/resend_otp", async function (req, res) {
  try {
    let { email } = req.body;
    let row = await database.Alumni.findOne({
      attributes: ["last_otp_sent"],
      where: {
        email,
      },
    });
    if (!row) {
      return helpers.responseHandle(
        400,
        responseMessages.ALUMNI_EMAIL_NOT_EXIST,
        res
      );
    }
    let { last_otp_sent } = helpers.wrapper(row);
    let last_otp_time = new Date(last_otp_sent);
    let current_time = new Date();
    const seconds_passed = Math.floor(
      Math.abs(current_time - last_otp_time) / 1000
    );
    if (seconds_passed < process.env.OTP_RETRY) {
      let diff = process.env.OTP_RETRY - seconds_passed;
      return helpers.responseHandle(
        400,
        responseMessages.OTP_RETRY_1 + diff + responseMessages.OTP_RETRY_2,
        res
      );
    } else {
      const otp = generateOTP((digits = 6)).toString();
      let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Document Requisition OTP",
        html: "The OTP for login is: <b>" + otp + "</b>",
      };
      // TODO: Send mail
      // let info = await otpTransporter.sendMail(mailOptions);
      // logger.info("Message ID: " + info.messageId)

      await database.Alumni.update(
        { otp, last_otp_sent },
        {
          where: {
            email,
          },
        }
      );
      return helpers.responseHandle(200, responseMessages.OTP_SENT, res);
    }
  } catch (err) {
    logger.error(err);
    return helpers.responseHandle(500, responseMessages.DEFAULT_500, res);
  }
});

module.exports = alumni;
