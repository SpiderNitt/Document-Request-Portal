require("dotenv").config({ path: "../env/.env" });

const admin = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const responseMessages = require("../utils/responseHandle");
const pino = require("pino");
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: process.env.ENV === "DEV",
});
const documentGenerator = require("../utils/documentGenerator");

const middlewares = require("../utils/middlewares");
const database = require("../database/database");
const helpers = require("../utils/helper");
const { determine_pending } = require("../utils/helper");
const helper = require("../utils/helper");

admin.use("/", middlewares.is_admin);

admin.post("/approvebonafide", async function (req, res) {
  let { certificate_id, comments } = req.body;
  if (!certificate_id)
    helpers.responseHandle(400, responseMessages.DEFAULT_400, res);
  let certificatePath = await database.CertificatePaths.findAll({
    where: { certificate_id: certificate_id, status: "APPROVED" },
  });
  let certificateDetails = await database.Certificate.findOne({
    where: { id: certificate_id },
  });
  let certificateDetail 
  if(certificateDetails)
  certificateDetail = helpers.wrapper(certificateDetails);
  console.log(certificateDetail)
  const fileName = uuid.v4() + ".pdf";
  let fileLocation =
    appRoot + "/uploads/" + certificateDetail.applier_roll + "/" + fileName;
  signImages = [];
  const photo = certificateDetail.photo;

  const photob64 = photo.toString("base64");
  for (let i = 0; i < certificatePath.length; i++) {
    path = helpers.wrapper(certificatePath[i]);
    const signTemp = await database.Admin.findOne({
      where: { name: path.path_name.replace("@nitt.edu", "") },
    });
    if(!signTemp) continue;
    const { sign } = helpers.wrapper(signTemp);
    const signb64 = sign.toString("base64");
    signImages.push(signb64);
  }
  const rollNo = req.jwt_payload.username;
  const signTemp = await database.Admin.findOne({ where: { name: rollNo } });
  if(signTemp) {
  const { sign } = helpers.wrapper(signTemp);
  const signb64 = sign.toString("base64");
  signImages.push(signb64);
  }
  while (signImages.length < 5) {
    signImages.push("");
  }

  const transcript = {
    fileLocation,
    signImages,
    photob64,
    certificateDetail
  };
  documentGenerator.generateTranscript(transcript);

  // flow of control reaches here irrespective of whether file is uplooaded or not
  // In Certificate Paths table, update the correspending admin row's status

  await database.CertificatePaths.update(
    { status: "APPROVED", comments },
    {
      where: {
        certificate_id,
        path_email: rollNo + "@nitt.edu",
      },
    }
  );
  // In Cerificate table, update status. If a file existed, this will just overwrite with the same value.
  // If a file did not exist, this will update the status alone.
  await database.Certificate.update(
    { status: rollNo + "@nitt.edu APPROVED", file: fileName },
    {
      where: {
        id: certificate_id,
      },
    }
  );
  // Add an entry in History table.
  // TODO: Use triggers instead of script
  await database.History.create({
    certificate_id,
    status: rollNo + "@nitt.edu APPROVED",
    time: new Date(Date.now()).toISOString(),
  });

  helpers.responseHandle(200, responseMessages.CERTIFICATE_APPROVE, res);
});
// Approve a certificate with an optional file
admin.post("/approve", async function (req, res) {
  try {
    // mutler file upload. Note that its SINGLE
    const upload = multer({
      storage: helpers.storage,
      fileFilter: helpers.docFilter,
    }).single("certificate");

    upload(req, res, async function (err) {
      if (err) {
        // If error in file upload
        logger.error(err);
        return helpers.responseHandle(
          400,
          responseMessages.VALIDATION_ERROR,
          res
        );
      } else {
        // If there is no error in file upload
        // Get the necessary details from the reqeust body

        let { certificate_id, comments } = req.body;
        let rollno = req.jwt_payload.username;

        // Determine if anyone after current admin has approved (or) anyone before current admin has declined
        let flag = await helpers.approve_decline_rights(req, certificate_id);

        if (req.file) {
          // if req.file exists, get filename, path, replace old file by admin file, update database with new file name.
          // initial dest: the upload into temp folder
          // final_dest: the path for uploads/roll_no/ with the filename
          let { filename } = req.file;
          let filepath = req.file.path;
          let initial_dest = appRoot + "/" + filepath;
          if (!flag) {
            // if admin cannot approve or decline, delete temp file.

            fs.unlinkSync(initial_dest);
            return helpers.responseHandle(
              401,
              responseMessages.CANNOT_APPROVE_DECLINE,
              res
            );
          } else {
            // admin can actually approve.
            // populate necessary tables
            let status = rollno + "@nitt.edu APPROVED";
            try {
              let row = await database.Certificate.findOne({
                attributes: ["file", "applier_roll"],
                where: {
                  id: certificate_id,
                },
              });
              let { file: old_filename, applier_roll } = helpers.wrapper(row);

              let final_dest =
                appRoot + "/uploads/" + applier_roll + "/" + filename;

              try {
                // delete preexisting file and move current file there.
                // Here, moving will not replace since the filename is different.
                // The preexisting file is deleted because its name is not stored in the database anymore

                fs.unlinkSync(
                  appRoot + "/uploads/" + applier_roll + "/" + old_filename
                );
                helpers.renameFile(initial_dest, final_dest);
              } catch (err) {
                // if there is any error deleting/moving files, remove the file in temp/ and ask user to try again
                fs.unlinkSync(initial_dest);
                logger.error(err);
                return helpers.responseHandle(
                  500,
                  responseMessages.FILE_UPLOAD,
                  res
                );
              }

              // Add necessary database entries

              // Update the entry with new filename and status in Certificates table
              await database.Certificate.update(
                { file: filename, status },
                {
                  where: {
                    id: certificate_id,
                  },
                }
              );
            } catch (err) {
              // If any error, delete temp/ file and ask user to try again.
              logger.error(err);
              fs.unlinkSync(initial_dest);
              return helpers.responseHandle(
                500,
                responseMessages.FILE_UPLOAD,
                res
              );
            }
          }
        }
        // flow of control reaches here irrespective of whether file is uplooaded or not
        // In Certificate Paths table, update the correspending admin row's status
        await database.CertificatePaths.update(
          { status: "APPROVED", comments },
          {
            where: {
              certificate_id,
              path_email: rollno + "@nitt.edu",
            },
          }
        );
        // In Cerificate table, update status. If a file existed, this will just overwrite with the same value.
        // If a file did not exist, this will update the status alone.
        await database.Certificate.update(
          { status: rollno + "@nitt.edu APPROVED" },
          {
            where: {
              id: certificate_id,
            },
          }
        );
        // Add an entry in History table.
        // TODO: Use triggers instead of script
        await database.History.create({
          certificate_id,
          status: rollno + "@nitt.edu APPROVED",
          time: new Date(Date.now()).toISOString(),
        });

        helpers.responseHandle(200, responseMessages.CERTIFICATE_APPROVE, res);
      }
    });
  } catch (err) {
    logger.error(err);
    helpers.responseHandle(500, responseMessages.DEFAULT_500, res);
  }
});

// Decline a document by admin without any file upload
admin.post("/decline", multer().none(), async function (req, res) {
  // get necessary details from Req payload
  let { certificate_id, comments } = req.body;
  let rollno = req.jwt_payload.username;

  // determine if admin can actually approve
  let flag = await helpers.approve_decline_rights(req, certificate_id);

  if (flag) {
    try {
      // populate necessary tables
      let status = rollno + "@nitt.edu DECLINED";

      // update Certificate Row with the status
      await database.Certificate.update(
        { status },
        {
          where: {
            id: certificate_id,
          },
        }
      );
      // update the Certificate Paths row with status and comments(optional)
      await database.CertificatePaths.update(
        { status: "DECLINED", comments },
        {
          where: {
            certificate_id,
            path_email: rollno + "@nitt.edu",
          },
        }
      );

      // update the history table
      // TODO: Use triggers
      await database.History.create({
        certificate_id,
        status,
        time: new Date(Date.now()).toISOString(),
      });

      helpers.responseHandle(200, responseMessages.CERTIFICATE_DECLINE, res);
    } catch (err) {
      // if any error, ask user to try again later
      logger.error(err);
      return helpers.responseHandle(500, responseMessages.FILE_DECLINE, res);
    }
  } else {
    return helpers.responseHandle(
      401,
      responseMessages.CANNOT_APPROVE_DECLINE,
      res
    );
  }
});

admin.get("/", async function (req, res) {
  /*
      Get details for which given admin has approved/declined/pending

    
      APPROVED OR DECLINED:
        Get details (where status = APPROVED or DECLINED) and append directly.
      PENDING:
        If path_no for given admin is 1 or admin for path_no - 1 has APPROVED, 
        append details.
  
    */

  try {
    let rollno = req.jwt_payload.username;
    let cert_id_sem_copies_mapping = []; // the set of all certificate_type ids that require a sem x no.of copies mapping
    const certTypes = await database.CertificateType.findAll({
      where: {
        semwise_mapping: 1,
      },
    });
    const adminFetch = await database.Admin.findOne({
      where: { name: rollno },
    });
    const adminDetail = helpers.wrapper(adminFetch);
    let sign = adminDetail.sign;
    if (sign) sign = sign.toString("base64");
    certTypes.forEach((cert) => {
      if (cert.length !== 0) {
        cert_id_sem_copies_mapping.push(cert.getDataValue("id"));
      }
    });
    // find all ids for which dude is the admin (all statuses)
    let path_details = await database.CertificatePaths.findAll({
      attributes: ["certificate_id", "path_no", "status"],
      where: {
        path_email: rollno + "@nitt.edu",
      },
    });
    let path_objects = [];

    // get row values and push it to array for further processing
    path_details.forEach(function (ele) {
      let { path_no, certificate_id, status } = helpers.wrapper(ele);
      path_objects.push({
        path_no,
        certificate_id,
        status,
      });
    });

    let response_json = [];

    /* Each path_object contains:
           path_no: The number in line for the admin
           status: APPROVED | PENDING | DECLINED
           certificate_id: ID of the certificate
        
        All of these are pertaining to the given admin
        */

    // for(i  =0 ;; ) loop does not handle await for each iteration
    for (const index in path_objects) {
      let path_object = path_objects[index];
      let { certificate_id, status } = path_object;
      let is_pending = await determine_pending(path_object);
      // Condition for given  response JSON
      if (["APPROVED", "DECLINED"].includes(status) || is_pending) {
        const ele = await database.Certificate.findOne({
          attributes: [
            "name",
            "applier_roll",
            "type",
            "address",
            "postal_status",
            "email_status",
            "receipt",
            "email_address",
            "contact",
            "purpose",
            "course_code",
            "course_name",
            "no_copies",
            "status",
            "id_file",
            "file",
            "semester",
            "department",
            "year"
          ],
          where: {
            id: certificate_id,
          },
        });
        const {
          name,
          applier_roll,
          type,
          postal_status,
          email_status,
          address,
          receipt,
          email_address,
          contact,
          purpose,
          course_code,
          course_name,
          no_copies,
          id_file,
          file,
          semester,
          department,
          year
        } = helpers.wrapper(ele);

        let response_rank_grade_rows = [];
        if (cert_id_sem_copies_mapping.includes(type)) {
          let rank_grade_rows = await database.RankGradeCard.findAll({
            attributes: ["semester_no", "no_copies"],
            where: {
              applier_roll,
              certificate_type: type,
              certificate_id,
            },
          });
          for (const ele of rank_grade_rows) {
            let { semester_no, no_copies } = helpers.wrapper(ele);
            response_rank_grade_rows.push({
              semester_no,
              no_copies,
            });
          }
        }

        approval_list = []
        comment_list = []
        let rows = await database.CertificatePaths.findAll({
          attributes: ["path_email", "comments"],
          where: {
            certificate_id: certificate_id,
            status: "APPROVED"
          },
        });
        rows.forEach(function (ele) {
          const {path_email, comments} = helper.wrapper(ele);
          approval_list.push(path_email);
          comment_list.push(path_email + " - " + comments + "\n");
        });

        response_json.push({
          id_extension: id_file.split(".").splice(-1)[0],
          certificate_extension: file.split(".").splice(-1)[0],
          applier_roll,
          certificate_type: type,
          certificate_id,
          status,
          postal_status,
          email_status,
          address,
          receipt,
          email: email_address,
          contact,
          purpose,
          course_code,
          course_name,
          no_copies,
          response_rank_grade_rows,
          name,
          approved: approval_list,
          comments: comment_list,
          semester,
          department,
          year
        });
      }
    }
    return res.status(200).json({ certificate: response_json, sign });
  } catch (err) {
    logger.error(err);
    return helpers.responseHandle(500, responseMessages.DEFAULT_500, res);
  }
});

admin.post("/postal_status", async function (req, res) {
  let { certificate_id, postal_status } = req.body;
  try {
    await database.Certificate.update(
      { postal_status },
      {
        where: {
          id: certificate_id,
        },
      }
    );
    helpers.responseHandle(200, responseMessages.POSTAL_STATUS_UPDATE, res);
  } catch (err) {
    logger.error(err);
    return helpers.responseHandle(
      500,
      responseMessages.POSTAL_STATUS_UPLOAD,
      res
    );
  }
});

admin.post("/email", async function (req, res) {
  const upload = multer({
    storage: helpers.storage,
    fileFilter: helpers.docFilter,
  }).array("certificate");

  upload(req, res, async function (err) {
    if (err) {
      // problem with file upload
      logger.error(err);
      return helpers.responseHandle(
        400,
        responseMessages.VALIDATION_ERROR,
        res
      );
    }
    if (!req.files) {
      return helpers.responseHandle(
        500,
        responseMessages.SINGLE_FILE_NOT_FOUND,
        res
      );
    } else {
      let { certificate_id } = req.body;
      if (!certificate_id) {
        return helpers.responseHandle(
          400,
          responseMessages.REQUIRED_FIELD,
          res
        );
      }

      id_exists = await database.Certificate.findOne({
        attributes: ["id", "email_address", "applier_roll", "type"],
        where: {
          id: certificate_id,
        },
      });

      if (id_exists == null) {
        // check whether given certificate id actually exists in the db
        return helpers.responseHandle(403, responseMessages.ACCESS_DENIED, res);
      }

      try {
        let to_email = id_exists.getDataValue("email_address");
        if (!to_email) {
          return helper.responseHandle(400, responseMessages.EMAIL_NULL, res);
        }
        let type_name_row = await database.CertificateType.findOne({
          attributes: ["name"],
          where: {
            id: id_exists.getDataValue("type"),
          },
        });
        let type_name = type_name_row.getDataValue("name");
        let applier_roll = id_exists.getDataValue("applier_roll");

        // CODE USING MAILTRANSPORTER
        // let mailDetails = {
        //     from: process.env.EMAIL,
        //     to: to_email,
        //     subject: 'Transcript',
        //     text: 'Dear ' + applier_roll + ',\n\tPlease find attached the ' + type_name + ' document that you requested.',
        //     attachments: [
        //         {
        //             filename: applier_roll + '_' + type_name + '.pdf',
        //             path: initial_dest,
        //             cid: filename
        //         }
        //     ]
        // };
        let attachments = [];
        req.files.forEach(function (ele) {
          let initial_dest = appRoot + "/" + ele.path;
          attachments.push({
            content: fs.readFileSync(initial_dest).toString("base64"),
            type: "application/pdf",
            disposition: "attachment",
            filename: applier_roll + "_" + type_name + "_" + ele.originalname,
          });
        });
        const msg = {
          to: to_email,
          from: process.env.EMAIL,
          subject: type_name,
          html:
            "Dear " +
            applier_roll +
            ",<br />&nbsp;&nbsp;Please find attached the <strong>" +
            type_name +
            "</strong> document(s) that you requested.",
          attachments,
        };

        // send email and update the email status
        await sgMail.send(msg);
        let email_status = "Email sent by " + req.jwt_payload.username;
        await database.Certificate.update(
          { email_status },
          {
            where: {
              id: certificate_id,
            },
          }
        );
        // Do not delete the temporary file, since it was uploaded by admin.
        // In case of issues, itll be easier to debug with files present.
        // CLEAN THE TEMP DIRECTORY MANUALLY
        return helpers.responseHandle(200, responseMessages.MAIL_SENT, res);

        // CODE USING MAIL TRANSPORTER
        // helpers.mailTransporter.sendMail(mailDetails, async function (err, data) {
        //     if (err) {
        //         logger.error(err);
        //         res.status(500).json({ 'message': 'Unable to send mail. Try again later' });
        //         fs.unlinkSync(initial_dest);

        //     } else {
        //         let email_status = "Email Sent";
        //         await database.Certificate.update(
        //             { email_status }, {
        //             where: {
        //                 id: certificate_id
        //             }

        //         })
        //         res.status(200).json({ 'message': 'Email sent successfully' });
        //         fs.unlinkSync(initial_dest);

        //     }
        // });
      } catch (err) {
        logger.error(err);
        return helpers.responseHandle(500, responseMessages.MAIL_NOT_SENT, res);
      }
    }
  });
});

admin.post("/sign_upload", async function (req, res) {
  const admin = req.jwt_payload.username;
  const admin_details = helper.wrapper(
    await database.Admin.findOne({ name: admin })
  );
  if (admin_details == null) {
    return helper.responseHandle(403, responseMessages.ACCESS_DENIED, res);
  }
  // File upload. Note multer().array for multiple file uploads
  const upload = multer({
    fileFilter: helper.imgFilter,
  }).single("image");
  upload(req, res, async function (err) {
    try {
      if (err) {
        // problem with file upload
        logger.error(err);
        return helper.responseHandle(
          400,
          responseMessages.FILE_SIZE_EXCESS,
          res
        );
      } else if (!req.file) {
        // if no file uploaded or exactly 2 files arent uploaded
        return helper.responseHandle(
          400,
          responseMessages.UPLOAD_ONLY_REQUIRED,
          res
        );
      } else {
        // get necessary data from req payload to add to database
        let img = req.file.buffer;

        try {
          // add to database
          await database.Admin.update(
            { sign: img },
            {
              where: {
                name: admin,
              },
            }
          );
          return helper.responseHandle(
            200,
            responseMessages.UPLOAD_SUCCESS,
            res
          );
        } catch (err) {
          logger.error(err);

          return helper.responseHandle(
            400,
            responseMessages.FILE_SIZE_EXCESS,
            res
          );
        }
      }
    } catch (err) {
      logger.error(err);

      return helper.responseHandle(500, responseMessages.DEFAULT_500, res);
    }
  });
});
module.exports = admin;
