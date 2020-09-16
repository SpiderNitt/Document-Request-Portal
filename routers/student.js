const student = require('express').Router()
const database = require('../database/database')
const multer = require('multer')
const helpers = require('../utils/helper')
const helper = require('../utils/helper')
const fs = require('fs')




student.post("/certificate_request", async function (req, res) {
    const upload = multer({ storage: helpers.storage, fileFilter: helpers.docFilter }).single('certificate');
    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return res.status(400).json({ 'message': req.fileValidationError });
        }
        else if (!req.file) {
            console.log(req.body.path)
            res.status(400).json({ 'message': 'Please select a file' });
            return;
        }
        else {
            let applier_roll = req.jwt_payload.username;
            let { destination, filename } = req.file;
            let filepath = req.file.path;
            let final_dest = appRoot + '/uploads/' + applier_roll;
            let initial_dest = appRoot + '/' + filepath;
            try {
                fs.mkdirSync(final_dest, { recursive: true })
                helper.renameFile(initial_dest, final_dest + '/' + filename);
            }
            catch (err) {
                console.log(err);
                fs.unlinkSync(initial_dest);
                res.status(500).json({ 'message': 'Some issue with the server. Try again later.' });
                return;
            }
            final_dest = final_dest + '/' + filename;
            if(!req.body.email && !req.body.address) 
            {
                res.status(400).json({'message': 'At least email or address must be present'});
                return;
            }
            if(!req.body.receipt){

                res.status(400).json({'message': 'No receipt number specified'});
                return;
            }
             
            let { type, path, comments, email, address, receipt } = req.body;
            path = path.split(',');


            let status = "PENDING VERIFICATION"
            try {
                if (!helpers.validate_mail(path)) {
                    res.status(400).json({ 'message': 'All mail IDs must end with nitt.edu' })
                    return;
                }
                let response = await database.Certificate.create({ type, applier_roll, file: filename, status, comments, email_address:email, address, receipt});

                let certificate_id = response.getDataValue('id');
                let time = new Date(Date.now()).toISOString();
                status = "INITIATED REQUEST"
                await database.History.create({ certificate_id, time, status })
                for (index in path) {
                    await database.CertificatePaths.create({ certificate_id, path_no: parseInt(index) + 1, path_email: path[index].trim(), path_name: path[index].trim(), status: 'PENDING' })
                }

                res.status(200).json({ 'message': 'Requested Successfully' })
            }
            catch (err) {
                console.log(err)
                fs.unlinkSync(final_dest);
                res.status(400).json({ 'message': 'Invalid Data' })
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
            'email_address'
        ],
        where: {
            applier_roll: rollno
        }
    });
    let response_json = []
    rows.forEach(function (ele) {
        response_json.push({ 'id': ele.getDataValue('id'), 'type': ele.getDataValue('type'), 'status': ele.getDataValue('status'), 'postal_status': ele.getDataValue('postal_status'), 'email_status': ele.getDataValue('email_status'), 'email_address': ele.getDataValue('email_address') })
    })

    res.status(200).json(response_json);
})

student.get('/certificate_download', async function (req, res) {

    let id = parseInt(req.query.id);
    let rollno = req.jwt_payload.username;
    let row, applier_roll;
    let isnum = /^\d+$/.test(rollno);
    if (isnum) {
        applier_roll = rollno;
        row = await database.Certificate.findOne({
            attributes: ['file'],
            where: {
                applier_roll: rollno,
                id
            }
        });

    }
    else {

        row = await database.Certificate.findOne({
            attributes: ['file', 'applier_roll'],
            where: {

                id
            }
        });
        applier_roll = row.getDataValue('applier_roll');
    }

    if (row == null)
        res.status(403).json({ "message": "You do not have appropriate permissions to access this resource." })
    else {

        let filename = row.getDataValue('file');
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
            res.status(403).json({ 'message': "You do not have the appropriate permissions to access the resource." })
            return;
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
            res.status(400).json({ 'message': 'ID needed for certificate history' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'message': 'Some issue with the server. Please try again later' });
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
        res.status(400).json({ 'message': 'Certificate type already exists' })
        return;
    }
    else {
        await database.CertificateType.create({ type: cert_type, created_by: username });
        res.status(200).json({ 'message': 'Created successfully' });
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
        res.status(500).json({ 'message': 'Some issue with the server. Please try again later' });
    }
})

module.exports = student