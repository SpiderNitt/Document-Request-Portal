require('dotenv').config({ path: '../env/.env' })


const admin = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const nodemailer = require('nodemailer');
const responseMessages = require('../utils/responseHandle')

const middlewares = require('../utils/middlewares')
const database = require("../database/database")
const helpers = require("../utils/helper");
const { response } = require('express');

admin.use('/', middlewares.is_admin);

admin.post('/approve', async function (req, res) {

    const upload = multer({ storage: helpers.storage, fileFilter: helpers.docFilter }).single('certificate')

    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            //return res.status(400).json({ 'message': req.fileValidationError });
            return helpers.responseHandle(400,responseMessages.VALIDATION_ERROR,res);
        }
        else {
            let { certificate_id, comments } = req.body;
            let rollno = req.jwt_payload.username;
            let flag = await helpers.approve_decline_rights(req, res, certificate_id);

            if (req.file) {
                let { filename } = req.file;
                let filepath = req.file.path;
                let initial_dest = appRoot + '/' + filepath;
                if (!flag) {
                    fs.unlinkSync(initial_dest);
                    return;
                }
                else {
                    let status = rollno + "@nitt.edu APPROVED";
                    try {
                        let row = await database.Certificate.findOne({
                            attributes: ['file', 'applier_roll'],
                            where: {
                                id: certificate_id,
                            }
                        })
                        let old_filename = row.getDataValue('file');
                        let applier_roll = row.getDataValue('applier_roll');
                        let final_dest = appRoot + "/uploads/" + applier_roll + '/' + filename;
                        try {
                            fs.unlinkSync(appRoot + "/uploads/" + applier_roll + '/' + old_filename);
                            helpers.renameFile(initial_dest, final_dest);
                        }
                        catch (err) {
                            fs.unlinkSync(initial_dest);
                            console.log(err);
                            //res.json(500).json({ 'message': "Some problem with the file upload" });
                            // fs.unlinkSync(final_dest);
                            return helpers.responseHandle(500,responseMessages.FILE_UPLOAD,res);

                        }
                        await database.Certificate.update({ file: filename, status }, {
                            where: {
                                id: certificate_id
                            }
                        });

                        // PROCESS FILE
                    }
                    catch (err) {
                        console.log(err);
                        fs.unlinkSync(initial_dest);
                        //res.json(500).json({ 'message': "Some problem with the file upload" });
                        
                        return helpers.responseHandle(500,responseMessages.FILE_UPLOAD,res);

                    }
                }
            }
            await database.CertificatePaths.update({ status: 'APPROVED', comments }, {
                where: {
                    certificate_id,
                    path_email: rollno + "@nitt.edu"
                }
            })
            await database.Certificate.update({ status: rollno + "@nitt.edu APPROVED" }, {
                where: {
                    id: certificate_id
                }
            })
            await database.History.create({ certificate_id, status: rollno + "@nitt.edu APPROVED", time: new Date(Date.now()).toISOString() })
            // res.status(200).json({ 'message': "Approved successfully" });
            helpers.responseHandle(200,responseMessages.CERTIFICATE_APPROVE,res)
        }
    })
});

admin.post('/decline', multer().none(), async function (req, res) {
    let { certificate_id, comments } = req.body;
    let rollno = req.jwt_payload.username;
    let flag = await helpers.approve_decline_rights(req, res, certificate_id);
    if (flag) {
        try {
            let status = rollno + "@nitt.edu DECLINED";
            await database.Certificate.update({ status }, {
                where: {
                    id: certificate_id
                }
            });
            await database.CertificatePaths.update({ status: 'DECLINED', comments }, {
                where: {
                    certificate_id,
                    path_email: rollno + "@nitt.edu"
                }
            })
            await database.History.create({ certificate_id, status, time: new Date(Date.now()).toISOString() })
            //res.status(200).json({ 'message': "Declined successfully" });
            helpers.responseHandle(200,responseMessages.CERTIFICATE_DECLINE,res)

        }
        catch (err) {
            console.log(err);
            //res.status(500).json({ 'message': "There was some error declining the file. Try again later" });
            return helpers.responseHandle(500,responseMessages.FILE_DECLINE,res);
        }

    }
})

admin.get("/", async function (req, res) {
     /*
    Get details for which given roll has approved.

    Get details for which given roll has declined.

    Get details for which given jwt roll is pending.
    If path_no is 1, then push to response
    else push to response only after path_no -1 has approved

    */
    try {
        let rollno = req.jwt_payload.username;
        let path_objects = [];

        // find all ids for which dude is the admin
        let path_details = await database.CertificatePaths.findAll({
            attributes: ['certificate_id', 'path_no', 'status'],
            where: {
                path_email: rollno + '@nitt.edu',
                status: 'PENDING'
            }
        });

        path_details.forEach(function (ele) {
            let path_no = ele.getDataValue('path_no');
            let certificate_id = ele.getDataValue('certificate_id');
            let status = ele.getDataValue('status')
            path_objects.push({
                path_no, certificate_id, status
            })
        })
        let approved_details = await database.CertificatePaths.findAll({
            attributes: ['certificate_id', 'path_no', 'status'],
            where: {
                path_email: rollno + '@nitt.edu',
                status: 'APPROVED'
            }
        })
        approved_details.forEach(function (ele) {
            let path_no = ele.getDataValue('path_no');
            let certificate_id = ele.getDataValue('certificate_id');
            let status = ele.getDataValue('status')
            path_objects.push({
                path_no, certificate_id, status
            })
        })

        let response_json = [];

        for (const index in path_objects) {
            let path_object = path_objects[index];
            let { path_no, certificate_id, status } = path_object;

            function sendResponse(e){
                response_json.push({
                id_extension : e.getDataValue('id_file').split('.').splice(-1)[0],
                certificate_extension : e.getDataValue('file').split('.').splice(-1)[0],
                applier_roll: e.getDataValue('applier_roll'),
                certificate_type: e.getDataValue('type'),
                certificate_id,
                status,
                postal_status: e.getDataValue('postal_status'),
                email_status: e.getDataValue('email_status'),
                address: e.getDataValue('address'),
                receipt: e.getDataValue('receipt'),
                email: e.getDataValue('email_address'),
                contact: e.getDataValue('contact'),
                purpose: e.getDataValue('purpose'),
                course_code: e.getDataValue('course_code'),
                course_name: e.getDataValue('course_name'),
                no_copies: e.getDataValue('no_copies')

            })}

            if (status === 'APPROVED') {
                const ele = await database.Certificate.findOne({
                    attributes: ['applier_roll', 'type', 'address', 'postal_status', 'email_status', 'receipt', 'email_address', 'contact', 'purpose', 'course_code', 'course_name', 'no_copies', 'file', 'id_file'],
                    where: {
                        id: certificate_id
                    }
                })
               sendResponse(ele);

            }
            else if (path_no == 1 && status === 'PENDING') {
                const ele = await database.Certificate.findOne({
                    attributes: ['applier_roll', 'type', 'address', 'postal_status', 'email_status', 'receipt', 'email_address', 'contact', 'purpose', 'course_code', 'course_name', 'no_copies', 'file', 'id_file'],
                    where: {
                        id: certificate_id
                    }
                })
                sendResponse(ele);
            }
            else if (path_no != 1) {
                const row = await database.CertificatePaths.findOne({
                    where: {
                        path_no: path_no - 1,
                        status: 'APPROVED',
                        certificate_id,
                    }
                });
                if (row != null) {
                    const ele = await database.Certificate.findOne({
                        attributes: ['applier_roll', 'type', 'address', 'postal_status', 'email_status', 'receipt', 'email_address', 'contact', 'purpose', 'course_code', 'course_name', 'no_copies', 'file', 'id_file'],
                        where: {
                            id: certificate_id
                        }
                    })
                    sendResponse(ele);
                }
            }

        }
        res.status(200).json(response_json);
    }
    catch (err) {
        console.log(err);
        //res.status(500).send({ 'message': 'Some issue with the server. Try again later' })
        return helpers.responseHandle(500,responseMessages.DEFAULT_500,res);
    }

});

admin.post('/postal_status', async function (req, res) {
    let { certificate_id, postal_status } = req.body;
    try {
        await database.Certificate.update({ postal_status }, {
            where: {
                id: certificate_id
            }
        })
        //res.status(200).json({ 'message': "Postal status Updated" });
        helpers.responseHandle(200,responseMessages.POSTAL_STATUS_UPDATE,res)
    }
    catch (err) {
        console.log(err);
        //res.status(500).json({ 'message': "There was some error uploading the message. Try again later" });
        return helpers.responseHandle(500,responseMessages.POSTAL_STATUS_UPLOAD,res);
    }

});

admin.post('/email', async function (req, res) {
    const upload = multer({ storage: helpers.storage, fileFilter: helpers.docFilter }).single('certificate')

    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            //return res.status(400).json({ 'message': req.fileValidationError });
            return helpers.responseHandle(400,responseMessages.VALIDATION_ERROR,res);
        }
        if (!req.file) {
            //res.status(400).json({ "message": "Please upload a file" })
            return helpers.responseHandle(500,responseMessages.FILE_NOT_FOUND,res);
            
        }
        else {
            let { certificate_id } = req.body;
            if (!certificate_id) {
                //res.status(400).json({ "message": "Please provide all required data" })
                return helpers.responseHandle(400,responseMessages.REQUIRED_FIELD,res);
                
            }
            if (req.file) {
                let { filename } = req.file;
                let filepath = req.file.path;
                let initial_dest = appRoot + '/' + filepath;


                id_exists = await database.Certificate.findOne({
                    attributes: ['id', 'email_address', 'applier_roll', 'type'],
                    where: {
                        id: certificate_id
                    }
                });

                if (id_exists == null) {
                    //res.status(403).json({ 'message': "You do not have the appropriate permissions to access the resource." })
                    return helpers.responseHandle(403,responseMessages.ACCESS_DENIED,res);
                    
                }

                try {
                    let to_email = id_exists.getDataValue('email_address');
                    let type_name_row = await database.CertificateType.findOne({
                        attributes: ['name'],
                        where: {
                            id: id_exists.getDataValue('type')
                        }
                    })
                    let type_name = type_name_row.getDataValue('name')
                    let applier_roll = id_exists.getDataValue('applier_roll');
                    let mailDetails = {
                        from: process.env.EMAIL,
                        to: to_email,
                        subject: 'Transcript',
                        text: 'Dear ' + applier_roll + ',\n\tPlease find attached the ' + type_name + ' document that you requested.',
                        attachments: [
                            {
                                filename: applier_roll + '_' + type_name + '.pdf',
                                path: initial_dest,
                                cid: filename
                            }
                        ]
                    };

                    helpers.mailTransporter.sendMail(mailDetails, async function (err, data) {
                        if (err) {
                            console.log(err);
                            //res.status(500).json({ 'message': 'Unable to send mail. Try again later' });
                            helpers.responseHandle(500,responseMessages.MAIL_NOT_SENT,res);
                            fs.unlinkSync(initial_dest);

                        } else {
                            let email_status = "Email Sent";
                            await database.Certificate.update(
                                { email_status }, {
                                where: {
                                    id: certificate_id
                                }

                            })
                            //res.status(200).json({ 'message': 'Email sent successfully' });
                            helpers.responseHandle(200,responseMessages.MAIL_SENT,res)
                            fs.unlinkSync(initial_dest);
                        }
                    });
                }
                catch (err) {
                    console.log(err);
                    fs.unlinkSync(initial_dest);
                    //res.json(500).json({ 'message': "Some problem with sending email" });
                      return helpers.responseHandle(500,responseMessages.MAIL_NOT_SENT,res);                
                }

            }
            else {
                //res.status(500).json({ 'message': "Kindly upload the document" });
                return helpers.responseHandle(400,responseMessages.FILE_NOT_FOUND,res);
            }
        }
    })

});


module.exports = admin;