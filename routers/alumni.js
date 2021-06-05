const { validateOrdinaryMail, generateOTP, otpTransporter } = require("../utils/helper");
const database = require("../database/database");
const jwt = require("jsonwebtoken");

const alumni = require("express").Router();

alumni.post("/register", async function (req, res) {
  try {
    let errors = {};
    let { name, roll_no, department, email, mobile } = req.body;

    if (!validateOrdinaryMail(email)) {
      errors.email = "Email is not valid";
    }

    if (!(mobile.length >= 10)) {
      errors.mobile = "Phone number is not valid";
    }

    if (errors != {}) {
      res.status(400).json({ success: false, message: "One or more errors were in your form.", errors });
      return;
    }

    // check if email is already in db
    let email_exists = await database.Alumni.findOne({
      attributes: ["id", "email"],
      where: {
        email,
      },
    });

    if (email_exists) {
      res.status(409).json({ success: false, message: "Email already registered. Try logging in." });
      return;
    }

    // Generate OTP
    const otp = generateOTP((digits = 6)).toString();
    let last_otp_sent = new Date(Date.now()).toISOString();

    // TODO: Email OTP
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Document Requisition OTP",
      html: "The OTP for login is: <b>" + otp + "</b>",
    };
    otpTransporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Some issue with the mail server. Try again later." });
        return;
      } else {
        console.log("Email sent for " + email);
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

        res.status(200).json({ success: true, message: "Registered successfully, OTP sent to registered mail." });
        return;
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Some issue with the server. Try again later." });
    return;
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
      res.status(409).json({ success: false, message: "Email does not exist. Register first." });
      return;
    }

    const otp = generateOTP((digits = 6)).toString();
    let last_otp_sent = new Date(Date.now()).toISOString();

    // TODO: Email OTP
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Document Requisition OTP",
      html: "The OTP for login is: <b>" + otp + "</b>",
    };
    otpTransporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Some issue with the mail server. Try again later." });
        return;
      } else {
        console.log("Email sent for " + email);
        // UPDATE IN DATABASE
        await database.Alumni.update(
          { otp, last_otp_sent },
          {
            where: {
              email,
            },
          }
        );

        res.status(200).json({ success: true, message: "Registered successfully, OTP sent to registered mail." });
        return;
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Some issue with the server. Try again later." });
    return;
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
      res.status(400).json({ success: false, message: "Email does not exist." });
      return;
    }
    let row = await database.Alumni.findOne({
      attributes: ["otp"],
      where: {
        email,
      },
    });
    let otp = row.getDataValue("otp");
    if (process.env.ENV == "DEV") {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 1 month
          data: { username },
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({ success: true, message: "Success", token });
      ReadableStreamDefaultController;
    }
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
      res.status(401).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Some issue with the server. Try again later." });
    return;
  }
});
