const student = require('express').Router()
const database = require('../database/database')
const multer = require('multer')
const helpers = require('../utils/helper')
const helper = require('../utils/helper')
const fs = require('fs')
const sequelize = require('sequelize')
const responseMessages = require('../utils/responseHandle')


student.post("/certificate_request", async function (req, res) {
    const upload = multer({ storage: helpers.storage, fileFilter: helpers.docFilter }).array('certificate');
    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return helper.responseHandle(400,responseMessages.VALIDATION_ERROR,res)
        }
        else if (!(req.files || req.files.length!=2)) {
            
            return helper.responseHandle(400,responseMessages.FILE_NOT_FOUND,res);
        }
        else {
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
                fs.mkdirSync(final_dest, { recursive: true })
                helper.renameFile(cert_initial_dest, final_dest + '/' + cert_filename);
                helper.renameFile(id_initial_dest, final_dest + '/' + "ID_" + id_filename);
            }
            catch (err) {
                console.log(err);
                fs.unlinkSync(cert_initial_dest);
                fs.unlinkSync(id_initial_dest);
                //res.status(500).json({ 'message': 'Some issue with the server. Try again later.' });
                
                return helper.responseHandle(500,responseMessages.DEFAULT_500,res);
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
                //res.status(400).json({ 'message': 'All compulsory fields are not present' });
                helper.responseHandle(400,responseMessages.REQUIRED_FIELD,res)
                fs.unlinkSync(cert_final_dest);
                fs.unlinkSync(id_final_dest);
                return;
            }

            let { type, path, comments, email, address, receipt, purpose, contact, course_code, course_name, no_copies } = req.body;
            path = path.split(',');


            let status = "PENDING VERIFICATION"
            try {
                if (!helpers.validate_mail(path)) {
                    //res.status(400).json({ 'message': 'All mail IDs must end with nitt.edu' })
                    helper.responseHandle(400,responseMessages.INVALID_MAILID,res)
                    fs.unlinkSync(cert_final_dest);
                    fs.unlinkSync(id_final_dest);
                    return;
                }
                let response = await database.Certificate.create({ type, applier_roll, file: cert_filename, status, comments, email_address: email, address, receipt, id_file: "ID_" + id_filename, contact, purpose, course_code, course_name, no_copies });

                let certificate_id = response.getDataValue('id');
                let time = new Date(Date.now()).toISOString();
                status = "INITIATED REQUEST"
                await database.History.create({ certificate_id, time, status })
                for (index in path) {
                    await database.CertificatePaths.create({ certificate_id, path_no: parseInt(index) + 1, path_email: path[index].trim(), path_name: path[index].trim(), status: 'PENDING' })
                }

                //res.status(200).json({ 'message': 'Requested Successfully' })
                helper.responseHandle(200,responseMessages.CERTIFICATE_REQUEST,res)
            }
            catch (err) {
                console.log(err)
                fs.unlinkSync(cert_final_dest);
                fs.unlinkSync(id_final_dest);
                //res.status(400).json({ 'message': 'Invalid Data' })
                return helper.responseHandle(400,responseMessages.INVALID_DATA,res)
            }
        }

    })
})

student.get("/", async function (req, res) {
    let rollno = req.jwt_payload.username;
    let rows = await database.Certificate.findAll({
        attributes: [
            'id',
            'type',
            'status',
            'postal_status',
            'email_status',
            'email_address',
            'contact',
            'purpose',
            'file',
            'id_file',
            'course_code',
            'course_name',
            'no_copies'
        ],
        where: {
            applier_roll: rollno
        }
    });
    let response_json = []
    rows.forEach(function (ele) {

        response_json.push({
            'id': ele.getDataValue('id'),
            'type': ele.getDataValue('type'),
            'status': ele.getDataValue('status'),
            'postal_status': ele.getDataValue('postal_status'),
            'email_status': ele.getDataValue('email_status'),
            'email_address': ele.getDataValue('email_address'),
            'contact': ele.getDataValue('contact'),
            'purpose': ele.getDataValue('purpose'),
            'id_extension': ele.getDataValue('id_file').split('.').splice(-1)[0],
            'certificate_extension': ele.getDataValue('file').split('.').splice(-1)[0],
            'course_code': ele.getDataValue('course_code'),
            'course_name': ele.getDataValue('course_name'),
            'no_copies': ele.getDataValue('no_copies')

        })
    })

    res.status(200).json(response_json);
})

student.get('/certificate_download', async function (req, res) {

    let id = parseInt(req.query.id);
    let column_name = 'file'
    console.log(req.query)
    if (req.query.id_cert) {
        column_name = 'id_file'
    }
    let rollno = req.jwt_payload.username;
    let row, applier_roll;
    let isnum = /^\d+$/.test(rollno);
    if (isnum) {
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

        row = await database.Certificate.findOne({
            attributes: [column_name, 'applier_roll'],
            where: {

                id
            }
        });
        applier_roll = row.getDataValue('applier_roll');
    }

    if (row == null)
        //res.status(403).json({ "message": "You do not have appropriate permissions to access this resource." })
        return helper.responseHandle(403,responseMessages.ACCESS_DENIED,res)
    else {

        let filename = row.getDataValue(column_name);
        let final_dest = appRoot + '/uploads/' + applier_roll + '/' + filename;
        res.status(200).sendFile(final_dest);
    }


})

student.get('/certificate_history', async function (req, res) {
    try {
        let { id } = req.query;
        let { username } = req.jwt_payload;
        let isnum = /^\d+$/.test(username);
        let id_exists;
        if (isnum) {
            id_exists = await database.Certificate.findOne({
                attributes: ['id', 'applier_roll', 'comments'],
                where: {
                    id,
                    applier_roll: username
                }

            });
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
            //res.status(403).json({ 'message': "You do not have the appropriate permissions to access the resource." })
           
            return helper.responseHandle(403,responseMessages.ACCESS_DENIED,res);
        }
        if (id) {
            let row = await database.History.findOne({
                attributes: ['time'],
                where: {
                    certificate_id: id,
                    status: 'INITIATED REQUEST'
                }
            });
            let applier_roll = id_exists.getDataValue('applier_roll')
            let response_json = []
            response_json.push({ 'path_email': applier_roll + '@nitt.edu', 'status': 'INITIATED REQUEST', 'time': row.getDataValue('time'), 'comments': id_exists.getDataValue('comments') });



            let rows = await database.CertificatePaths.findAll({
                attributes: ['path_email', 'updatedAt', 'status', 'comments'],
                where: {
                    certificate_id: id
                }
            });


            rows.forEach(function (ele) {
                response_json.push({
                    'status': ele.getDataValue('status'),
                    'path_email': ele.getDataValue('path_email'),
                    'time': ele.getDataValue('updatedAt'),
                    'comments': ele.getDataValue('comments')
                })
            })

            res.status(200).json(response_json)
        }
        else {
            //res.status(400).json({ 'message': 'ID needed for certificate history' })
            return helper.responseHandle(400,responseMessages.ID,res);
        }
    } catch (err) {
        console.log(err);
        //res.status(500).json({ 'message': 'Some issue with the server. Please try again later' });
        return helper.responseHandle(500,responseMessages.DEFAULT_500,res);
    }
})

student.post('/add_certificate', async function (req, res) {
    let { cert_type } = req.body;
    let { username } = req.jwt_payload;
    let type_exists = await database.CertificateType.findOne({
        attributes: ['id', 'type'],
        where: {
            type: cert_type
        }
    })
    if (type_exists != null) {
        //res.status(400).json({ 'message': 'Certificate type already exists' })
        
        return helper.responseHandle(400,responseMessages.CERTIFICATE_TYPE_EXIST,res);
    }
    else {
        await database.CertificateType.create({ type: cert_type, created_by: username });
        //res.status(200).json({ 'message': 'Created successfully' });
        return helper.responseHandle(200,responseMessages.CREATE_CERTIFICATE,res);
    }

})

student.get('/certificate_types', async function (req, res) {
    try {
        let rows = await database.CertificateType.findAll();
        let response_json = []
        rows.forEach(function (ele) {
            response_json.push({
                'id': ele.getDataValue('id'),
                'type': ele.getDataValue('name')
            })
        })
        res.status(200).json(response_json);
    }
    catch (err) {
        console.log(err);
        //res.status(500).json({ 'message': 'Some issue with the server. Please try again later' });
        return helper.responseHandle(500,responseMessages.DEFAULT_500,res);
    }
})


student.get('/address', async function (req, res) {

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
            return helper.responseHandle(200,[],res);
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
        console.log(err);
        //res.status(500).json({ 'message': 'Some issue with the server. Please try again later' });
        return helper.responseHandle(500,responseMessages.DEFAULT_500,res)
    }
})

module.exports = student