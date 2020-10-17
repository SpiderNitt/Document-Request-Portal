const student = require('express').Router()
const database = require('../database/database')
const multer = require('multer')
const helper = require('../utils/helper')
const fs = require('fs')
const sequelize = require('sequelize')
const responseMessages = require('../utils/responseHandle')

const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info',  prettyPrint: process.env.ENV === 'DEV' });

// Student Document Request
// Along with string payload, contains 2 files. 
// 1st file: Necessary document
// 2nd file: ID proof
student.post("/certificate_request", async function (req, res) {

    // File upload. Note multer().array for multiple file uploads
    const upload = multer({ storage: helper.storage, fileFilter: helper.docFilter }).array('certificate');
    upload(req, res, async function (err) {
        if (err) {
            // problem with file upload
            logger.error(err)
            return helper.responseHandle(400, responseMessages.VALIDATION_ERROR, res)
        }
        else if (!(req.files || req.files.length != 2)) {
            // if no file uploaded or exactly 2 files arent uploaded
            return helper.responseHandle(400, responseMessages.UPLOAD_ONLY_REQUIRED, res);
        }
        else {
            // get necessary data from req payload to add to database
            let applier_roll = req.jwt_payload.username;
            let cert_destination = req.files[0].destination;
            let cert_filepath = req.files[0].path;
            let id_destination = req.files[1].destination;
            let id_filepath = req.files[1].path;
            let cert_filename = req.files[0].filename;
            let id_filename = req.files[1].filename;
            let final_dest = appRoot + '/uploads/' + applier_roll;
            let cert_initial_dest = appRoot + '/' + cert_filepath;
            let id_initial_dest = appRoot + '/' + id_filepath;
            try {
                // Create a directory for the roll number -> uploads/roll_no/
                fs.mkdirSync(final_dest, { recursive: true })

                // move both ID and Cert
                helper.renameFile(cert_initial_dest, final_dest + '/' + cert_filename);
                helper.renameFile(id_initial_dest, final_dest + '/' + "ID_" + id_filename);
            }
            catch (err) {
                logger.error(err);
                fs.unlinkSync(cert_initial_dest);
                fs.unlinkSync(id_initial_dest);

                return helper.responseHandle(500, responseMessages.DEFAULT_500, res);
            }
            let cert_final_dest = final_dest + '/' + cert_filename;
            let id_final_dest = final_dest + '/' + id_filename;
            // if(!req.body.email && !req.body.address) 
            // {
            //     res.status(400).json({'message': 'At least email or address must be present'});
            //     fs.unlinkSync(cert_final_dest);
            //     fs.unlinkSync(id_final_dest);
            //     return;
            // }
            // if(!req.body.receipt){

            //     res.status(400).json({'message': 'No receipt number specified'});
            //     return;
            // }
            if (!helper.check_compulsory(req.body, ['type', 'path', 'purpose', 'contact'])) {
                // These fields must be present for every request.
                // Other fields depend on the cert type, and are not considered necessary.
                // TODO: Make other fields compulsory depending on the certificate type
                // TODO: modify check_compulsory to include necessary fields based on cert tyoe

                helper.responseHandle(400, responseMessages.REQUIRED_FIELD, res)
                fs.unlinkSync(cert_final_dest);
                fs.unlinkSync(id_final_dest);
                return;
            }

            let { type, path, comments, email, address, receipt, purpose, contact, course_code, course_name, no_copies, semester_no, rank_grade_card_copies } = req.body;
            let sem_nos, card_copies;
            if (semester_no && rank_grade_card_copies) {
                sem_nos = semester_no.split(',');
                card_copies = rank_grade_card_copies.split(',');
            }
            path = path.split(',');
            let status = "PENDING VERIFICATION"
            try {
                if (!helper.validate_mail(path)) {
                    //res.status(400).json({ 'message': 'All mail IDs must end with nitt.edu' })
                    helper.responseHandle(400, responseMessages.INVALID_MAILID, res)
                    fs.unlinkSync(cert_final_dest);
                    fs.unlinkSync(id_final_dest);
                    return;
                }
                let response = await database.Certificate.create({ type, applier_roll, file: cert_filename, status, comments, email_address: email, address, receipt, id_file: "ID_" + id_filename, contact, purpose, course_code, course_name, no_copies });

                let certificate_id = response.getDataValue('id');
                const certTypes = await database.CertificateType.findAll({
                    where: {
                        semwise_mapping: 1
                    }
                });
                let semwise_types = [];
                certTypes.forEach(function (ele) {
                    let { id } = helper.wrapper(ele)
                    semwise_types.push(id.toString())
                })
               
                let rank_grade_flag = semwise_types.includes(type) ? true : false;
                let rank_grade_mapping = []
                if (rank_grade_flag) {
                    for (let i = 0; i < sem_nos.length; i++) {
                        rank_grade_mapping.push(
                            {
                                sem_no: sem_nos[i],
                                no_copies: card_copies[i]
                            }
                        )
                    }
                }
                for (const sem_mapping of rank_grade_mapping) {
                    let {sem_no, no_copies} = sem_mapping;
                    await database.RankGradeCard.create({ certificate_id, applier_roll, certificate_type: type, semester_no: sem_no, no_copies });
                }
                let time = new Date(Date.now()).toISOString();
                status = "INITIATED REQUEST"
                await database.History.create({ certificate_id, time, status })
                for (index in path) {
                    await database.CertificatePaths.create({ certificate_id, path_no: parseInt(index) + 1, path_email: path[index].trim(), path_name: path[index].trim(), status: 'PENDING' })
                }

                helper.responseHandle(200, responseMessages.CERTIFICATE_REQUEST, res)
            }
            catch (err) {
                logger.error(err)
                fs.unlinkSync(cert_final_dest);
                fs.unlinkSync(id_final_dest);

                return helper.responseHandle(400, responseMessages.INVALID_DATA, res)
            }
        }

    })
})

student.get('/certificate_download', async function (req, res) {

    let id = parseInt(req.query.id);
    let column_name = 'file'

    if (req.query.id_cert) {
        column_name = 'id_file'
    }

    let rollno = req.jwt_payload.username;
    let row, applier_roll;
    let isnum = /^\d+$/.test(rollno);
    if (isnum) {
        // if roll_no is all numerical: student
        // Give certificate only if roll no matches for the given id

        applier_roll = rollno;
        row = await database.Certificate.findOne({
            attributes: [column_name],
            where: {
                applier_roll: rollno,
                id
            }
        });

    }
    else {
        // rolnumber has letters -> admin
        // Give any certificate
        // TODO: Give certificate only if ID matches in CertificatePath for given admin

        row = await database.Certificate.findOne({
            attributes: [column_name, 'applier_roll'],
            where: {

                id
            }
        });
        applier_roll = row.getDataValue('applier_roll');
    }

    if (row == null) // no resource found for the given id
        return helper.responseHandle(403, responseMessages.ACCESS_DENIED, res)
    else {

        let filename = row.getDataValue(column_name);
        let final_dest = appRoot + '/uploads/' + applier_roll + '/' + filename;
        res.status(200).sendFile(final_dest);
    }


})

student.get("/", async function (req, res) {
    try {
        let rank_grade_flag = false;
        let cert_id_sem_copies_mapping = [] // the set of all certificate_type ids that require a sem x no.of copies mapping
        const certTypes = await database.CertificateType.findAll({
            where: {
                semwise_mapping: 1
            }
        });
        certTypes.forEach(cert => {
            if (cert.length !== 0) {
                cert_id_sem_copies_mapping.push(cert.getDataValue('id'));
            }
        })

        let rollno = req.jwt_payload.username;
        let rows = await database.Certificate.findAll({
            attributes: [
                "id",
                "type",
                "status",
                "postal_status",
                "email_status",
                "email_address",
                "contact",
                "purpose",
                "file",
                "id_file",
                "course_code",
                "course_name",
                "no_copies"
            ],
            where: {
                applier_roll: rollno,
            },
        });
        let response_json = [];

        for (const ele of rows) {
            const {
                id,
                type,
                status,
                postal_status,
                email_status,
                email_address,
                contact,
                purpose,
                file,
                id_file,
                course_code,
                course_name,
                no_copies
            } = helper.wrapper(ele);
            let response_rank_grade_rows = [];
            if (cert_id_sem_copies_mapping.includes(type)) {
                let rank_grade_rows = await database.RankGradeCard.findAll({
                    attributes: [
                        'semester_no',
                        'no_copies',
                    ],
                    where: {
                        applier_roll: rollno,
                        certificate_type: type,
                        certificate_id: id
                    }
                });
                for (const ele of rank_grade_rows) {
                    let { semester_no, no_copies } = helper.wrapper(ele);
                    response_rank_grade_rows.push({
                        semester_no, no_copies
                    })
                }
            }

            response_json.push({
                id,
                type,
                status,
                postal_status,
                email_status,
                email_address,
                contact,
                purpose,
                course_code,
                course_name,
                no_copies,
                response_rank_grade_rows,
                id_extension: id_file.split('.').splice(-1)[0],
                certificate_extension: file.split('.').splice(-1)[0],
            });
        }

        res.status(200).json(response_json);
    }
    catch (err) {
        logger.error(err);
        return helper.responseHandle(500, responseMessages.DEFAULT_500, res);
    }
});

student.get("/address", async function (req, res) {

    let response_json = []
    try {
        let rows = await database.Certificate.findAll({
            attributes: [sequelize.fn('DISTINCT', sequelize.col('address')), 'address'],
            where: {
                applier_roll: req.jwt_payload.username
            }
        })
        if (rows == null) {
            // res.status(200).json([]);
            // return;
            return helper.responseHandle(200, [], res);
        }
        else {
            rows.forEach(function (ele) {
                let address = ele.getDataValue('address')
                if (address != null)
                    response_json.push(address)
            })
            res.status(200).json(response_json);
            return;
        }
    }
    catch (err) {
        logger.error(err);
        //res.status(500).json({ 'message': 'Some issue with the server. Please try again later' });
        return helper.responseHandle(500, responseMessages.DEFAULT_500, res)
    }

});

student.get('/certificate_types', async function (req, res) {
    try {
        let rows = await database.CertificateType.findAll();
        let response_json = []
        rows.forEach(function (ele) {
            let { id, name, semwise_mapping } = helper.wrapper(ele)
            response_json.push({
                id, name, semwise_mapping
            })
        })
        res.status(200).json(response_json);
    }
    catch (err) {
        logger.error(err);
        return helper.responseHandle(500, responseMessages.DEFAULT_500, res);
    }
});

student.post("/add_certificate", async function (req, res) {
    try {
        let { cert_type } = req.body;
        if (!cert_type) {
            return helper.responseHandle(400, responseMessages.REQUIRED_FIELD, res);
        }
        let { username } = req.jwt_payload;
        let type_exists = await database.CertificateType.findOne({
            attributes: ["id", "name"],
            where: {
                name: cert_type,
            },
        });

        if (type_exists != null) {

            return helper.responseHandle(400, responseMessages.CERTIFICATE_TYPE_EXIST, res);
        }
        else {
            await database.CertificateType.create({ name: cert_type, created_by: username, semwise_mapping: req.body.semwise_mapping ? 1 : 0 });
            return helper.responseHandle(200, responseMessages.CREATE_CERTIFICATE, res);
        }
    } catch (err) {
        logger.error(err);
        return helper.responseHandle(500, responseMessages.DEFAULT_500, res);
    }

})

student.get("/certificate_history", async function (req, res) {
    try {
        let { id } = req.query;
        let { username } = req.jwt_payload;
        let isnum = /^\d+$/.test(username);
        let id_exists;
        if (isnum) {
            id_exists = await database.Certificate.findOne({
                attributes: ["id", "applier_roll", "comments"],
                where: {
                    id,
                    applier_roll: username
                }
            })
        }
        else {
            id_exists = await database.Certificate.findOne({
                attributes: ['id', 'applier_roll', 'comments'],
                where: {
                    id
                }
            });
        }
        if (id_exists == null) {
            return helper.responseHandle(403, responseMessages.ACCESS_DENIED, res);
        }

        if (id) {
            let row = await database.History.findOne({
                attributes: ["time"],
                where: {
                    certificate_id: id,
                    status: "INITIATED REQUEST",
                },
            });
            let { applier_roll, comments } = helper.wrapper(id_exists);
            let { time } = helper.wrapper(row);
            let response_json = [];
            response_json.push({
                path_email: applier_roll + "@nitt.edu",
                status: "INITIATED REQUEST",
                time,
                comments,
            });

            let rows = await database.CertificatePaths.findAll({
                attributes: ["path_email", "updatedAt", "status", "comments"],
                where: {
                    certificate_id: id,
                },
            });

            rows.forEach(function (ele) {
                const { status, path_email, updatedAt, comments } = helper.wrapper(
                    ele
                );
                response_json.push({
                    status,
                    path_email,
                    time: updatedAt,
                    comments,
                });
            });
            res.status(200).json(response_json);
        }
        else {
            return helper.responseHandle(400, responseMessages.ID, res);
        }
    }
    catch (err) {
        logger.error(err);
        return helper.responseHandle(500, responseMessages.DEFAULT_500, res);

    }
});

module.exports = student;
