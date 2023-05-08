require("dotenv").config({ path: "../env/.env" });

const uuid = require("uuid");
const multer = require("multer");
const database = require("../database/database");
const fs = require("fs");
const nodemailer = require("nodemailer");
const MulterError = multer.MulterError;
const pino = require("pino");
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: process.env.ENV === "DEV",
});
const axios = require("axios");
const {departmentEmail} = require("./emailList")

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const otpTransporter = nodemailer.createTransport({
  service: "gmail",
  // host: "webmail.nitt.edu",
  // port: 465,
  // secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
const responseHandle = (status_code, message, res, errors = {}) => {
  let success = status_code == 200 ? true : false;
  return res.status(status_code).json({ success, message, errors });
};

function renameFile(oldPath, newPath) {
  fs.renameSync(oldPath, newPath, (err) => {
    if (err) throw err;
  });
}

const docFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(docx|DOCX|doc|DOC|pdf|PDF)$/)) {
    req.fileValidationError = "Only pdf and doc files are allowed!";
    cb(new MulterError("Only pdf and doc files allowed"), false);
  }
  cb(null, true);
};

const imgFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(png|jpg|jpeg|JPG|JPEG|PNG)$/)) {
    req.fileValidationError = "Only images are allowed!";
    cb(new MulterError("Only images allowed"), false);
  }
  cb(null, true);
};

function validate_mail(path) {
  for (index in path) {
    let words = path[index].split("@");
    if (words[words.length - 1] != "nitt.edu") return false;
  }
  return true;
}

function validateOrdinaryMail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

function validateRoll(roll){
  const re = /^\d+$/;
  return re.test(String(roll).toLowerCase());

}

// Determines whether admin can actually approve/decline
// If admin before current admin has declined (or)
// if admin after current admin has approved
// THen the current status of admin for a certificate
// should not be changed, as it might introduce inconsistency.

// AN admin can approve or decline a ceritificate if:
// Any admin before current admin SHOULD NOT HAVE PENDING
// All admin after current admin SHOULD HAVE PENDING

async function approve_decline_rights(req, certificate_id) {
  let rollno = req.jwt_payload.username;
  let path_ids = await database.CertificatePaths.findAll({
    attributes: ["path_email", "path_no", "status"],
    where: {
      certificate_id,
    },
  });
  let path_array = [];
  path_ids.forEach(function (ele) {
    path_array.push({
      no: ele.getDataValue("path_no"),
      email: ele.getDataValue("path_email"),
      status: ele.getDataValue("status"),
    });
  });

  let flag = false;
  let current_verified = -1;
  path_array.forEach(function (ele) {
    if (ele.email == rollno + "@nitt.edu") {
      current_verified = ele.no;
    }
  });

  path_array.forEach(function (ele) {
    // for path_no less than current, if the status is PENDING, then current admin cant approve
    if (ele.no < current_verified && ele.status.includes("PENDING"))
      return false;
  });

  path_array.forEach(function (ele) {
    // for path_no > current, if the status iS NOT PENDING, then current admin cannot approve
    if (ele.no > current_verified && !ele.status.includes("PENDING")) {
      return false;
    }
  });
  return true;
}

function get_extension(file) {
  let extension_array = file.originalname.split(".");
  return extension_array[extension_array.length - 1];
}

function check_compulsory(dict, keys) {
  for (const key of keys) {
    if (!dict[key]) return false;
  }
  return true;
}

const storage = multer.diskStorage({
  destination: "temp/",
  filename: function (req, file, cb) {
    let extension = get_extension(file);
    cb(null, uuid.v4() + "." + extension);
  },
});

function generateOTP(digits = 6) {
  const allDigits = "0123456789";
  let otp = "";
  for (let i = 0; i < digits; i++) {
    otp += allDigits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
//wrapper using row.getDataValue(attribute)
function wrapper(row) {
  let attributes = Object.keys(row.dataValues);
  const object = {};
  attributes.forEach((attribute) => {
    if (row.getDataValue(attribute)) {
      object[attribute] = row.getDataValue(attribute);
    } else {
      object[attribute] = null;
    }
  });
  return object;
}

async function determine_pending({ path_no, certificate_id, status }) {
  if (status !== "PENDING") return false;
  if (path_no === 1) return true;
  const row = await database.CertificatePaths.findOne({
    where: {
      path_no: path_no - 1,
      status: "APPROVED",
      certificate_id,
    },
  });
  if (row) return true;
  return false;
}

function handle_defaults(path, name, department) {
  path = path.map((ele) => ele.trim());
  if (name.toLowerCase().includes("bonafide")) {
    if (!path.includes(departmentEmail[department])) path.push(departmentEmail[department]);
    if (!path.includes("swoffice@nitt.edu")) path.push("swoffice@nitt.edu");
    if (!path.includes("adsw@nitt.edu")) path.push("adsw@nitt.edu");
  } else if (name.toLowerCase().includes("registration")) {
    if (!path.includes("ugacad@nitt.edu")) path.push("ugacad@nitt.edu");
    if (!path.includes("ugsection@nitt.edu")) path.push("ugsection@nitt.edu");
  } else if (
    name.toLowerCase().includes("transcript") ||
    name.toLowerCase().includes("card")
  )
    path = ["transcript@nitt.edu"];
  return path;
}

const validateHuman = async (req, res, next) => {
  try {
    let { recaptcha } = req.body;
    if(recaptcha == undefined || recaptcha == null)
    {
      recaptcha = req.headers.recaptcha;
    }
    const secret = process.env.RECAPTCHA_SECRET;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptcha}`;

    const result = await axios.post(url);

    if (result.data.success) {
      return next();
    } else {
      return res.status(402).json({ message: "Failed captcha verification" });
    }
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({ message: "Server Error. Try agin later!" });
  }
};



module.exports = {
  docFilter,
  storage,
  approve_decline_rights,
  validate_mail,
  renameFile,
  mailTransporter,
  check_compulsory,
  generateOTP,
  validateOrdinaryMail,
  validateHuman,
  otpTransporter,
  wrapper,
  determine_pending,
  responseHandle,
  handle_defaults,
  validateRoll,
  imgFilter,
};
