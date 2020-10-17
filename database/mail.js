const database = require("./database");
const sequelize = require("sequelize");
const helper = require("../utils/helper");
const cron = require("node-cron");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const pino = require("pino");
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: process.env.ENV === "DEV",
});
// require('dotenv').config({ path: '../env/.env' })

/* TODO: The output mail is (any non transcript person): 
/* You have 25 requests pending approval. Visit so and so.

/* TODO: OUtput of mail for transcript final person is:
Dear person, 
 You have 25 requests pending verification, and (if both email and postal status is null ) 15 verified requests to process. 
*/

/*
Any non transcript final person:
Dear person, 
You  have 15 requests pending. Visit so and so. 
*/

/*
Flow:
Non transcript:
1. Get all distinct mail ids whose status is Pending and immediately previous has approved.
2. Count total number of such ids and send it as mail

Transcript:
1. Get all transcript mail whose status is pending and immediately previous has aproved.
2. Get all transcript mail whose status is approved but email_status and postal_status is null for that id in certificates table.
3. Count total number of 1. + 2.

*/

async function fetchDistinctMails() {
  let mails = [];
  const distinct_mails = await database.CertificatePaths.findAll({
    attributes: [
      sequelize.fn("DISTINCT", sequelize.col("path_email")),
      "path_email",
    ],
  });
  distinct_mails.forEach(function (ele) {
    if (ele != null) {
      mails.push(ele.getDataValue("path_email"));
    }
  });
  return mails;
}

async function driver() {
  let final_mail_counter_dict = [];
  const mails = await fetchDistinctMails();
  for (const mail of mails) {
    let pending_count = 0;
    let approved_without_postal_email_count = 0;
    let ids_array = [];
    const cert_ids = await database.CertificatePaths.findAll({
      attributes: [
        sequelize.fn("DISTINCT", sequelize.col("certificate_id")),
        "certificate_id",
      ],
      where: {
        path_email: mail,
        status: {
          [sequelize.Op.or]: ["PENDING", "APPROVED"],
        },
      },
    });
    cert_ids.forEach(function (ele) {
      if (ele != null) {
        ids_array.push(ele.getDataValue("certificate_id"));
      }
    });
    for (const id of ids_array) {
      let path_detail = await database.CertificatePaths.findOne({
        attributes: ["path_no", "status"],
        where: {
          certificate_id: id,
          path_email: mail,
        },
      });
      let path_no = path_detail.getDataValue("path_no");
      let status = path_detail.getDataValue("status");
      if (status === "PENDING") {
        if (path_no === 1) {
          pending_count++;
        } else {
          const row = await database.CertificatePaths.findOne({
            attributes: ["certificate_id"],
            where: {
              status: "APPROVED",
              path_no: path_no - 1,
              certificate_id: id,
            },
          });
          if (row != null) {
            pending_count++;
          }
        }
      }
      // goes to else if status is approved for the given ID
      else {
        const row = await database.Certificate.findOne({
          attributes: ["email_status", "postal_status"],
          where: {
            id,
          },
        });
        let email_status = row.getDataValue("email_status");
        let postal_status = row.getDataValue("postal_status");
        if (email_status == null && postal_status == null) {
          approved_without_postal_email_count++;
        }
      }
    }
    final_mail_counter_dict.push({
      MAIL: mail,
      PENDING: pending_count,
      APPROVED_WITHOUT_STATUS: approved_without_postal_email_count,
    });
    // for each mail, we have ocnstructed an array of unique IDs.
    // Now, for each id, get path number.
    // if path number is 1, push id to final count.
    // else push id to final count only if status of that id with pathno-1 is approved
  }

  for (const mail_object of final_mail_counter_dict) {
    let message =
      "Respected Sir/Madam,<br />" +
      "There are <strong>" +
      mail_object.PENDING +
      "</strong> requests pending.";

    mail_object.MAIL.includes("transcript")
      ? (message +=
          "<br />There are " +
          mail_object.APPROVED_WITHOUT_STATUS +
          " requests that are verified but are not delivered through postal or email")
      : (message += "");
    message +=
      '<br />Kindly visit <a href="https://studentrequest.nitt.edu">studentrequest.nitt.edu </a> to approve or reject them.<br /> ';
    // let mailDetails = {
    //   from: process.env.EMAIL,
    //   to: mail_object.MAIL,
    //   subject: "Pending Requests",
    //   text: message,
    // };

    const msg = {
      to: mail_object.MAIL,
      from: process.env.EMAIL,
      subject: "Pending Document Requests",
      html: message,
    };
    try {
      await sgMail.send(msg);
      logger.info(
        "Mail sent to " + mail_object.MAIL + " on " + new Date().toTimeString()
      );
    } catch (err) {
      logger.error(err);
      logger.info(
        "Unable to send mail to " +
          mail_object.MAIL +
          " on " +
          new Date().toTimeString()
      );
    }
    // helper.mailTransporter.sendMail(mailDetails, async function (err, data) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(
    //       "mail sent successfully for " +
    //         mail_object.MAIL +
    //         " on " +
    //         new Date().toTimeString()
    //     );
    //   }
    // });
  }
}
cron.schedule("0 9 * * *", function () {
  logger.info("Sending mail every 9AM");
  driver();
});
// driver();
