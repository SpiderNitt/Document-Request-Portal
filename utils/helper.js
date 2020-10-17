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

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const responseHandle = (status_code, message, res) => {
  let success = status_code == 200 ? true : false;
  return res.status(status_code).json({ success, message });
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

function validate_mail(path) {
  for (index in path) {
    let words = path[index].split("@");
    if (words[words.length - 1] != "nitt.edu") return false;
  }
  return true;
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

module.exports = {
  docFilter,
  storage,
  approve_decline_rights,
  validate_mail,
  renameFile,
  mailTransporter,
  check_compulsory,
  wrapper,
  determine_pending,
  responseHandle,
};
