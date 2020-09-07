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
        else if(!req.file){
            // OPTIONAL FIL APPROVE GOES HERE
            console.log(req.body.path)
            res.status(400).json({'message': 'Please select a file'});
            return;
        }
        else {
            console.log("this file::: ", req.file)
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
            final_dest = final_dest +  '/' + filename;
            let { type, path } = req.body;
            if (typeof (path) == String)
                path = path.split(',');


            let status = "PENDING VERIFICATION"
            try {
                if (!helpers.validate_mail(path)) {
                    res.status(400).json({ 'message': 'All mail IDs must end with nitt.edu' })
                    return;
                }
                let response = await database.Certificate.create({ type, applier_roll, file: filename, status });

                let certificate_id = response.getDataValue('id');
                let time = new Date(Date.now()).toISOString();
                status = "INITIATED REQUEST"
                await database.History.create({ certificate_id, time, status })
                for (index in path) {
                    await database.CertificatePaths.create({ certificate_id, path_no: parseInt(index) + 1, path_email: path[index], path_name: path[index], status: 'PENDING' })
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
            'status'
        ],
        where: {
            applier_roll: rollno
        }
    });
    let response_json = []
    rows.forEach(function (ele) {
        response_json.push({ 'id': ele.getDataValue('id'), 'type': ele.getDataValue('type'), 'status': ele.getDataValue('status') })
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
        row = await Certificate.findOne({
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

        let id_exists = await database.Certificate.findOne({
            attributes: ['id'],
            where: {
                id,
                applier_roll: username
            }

        });
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
            let response_json = []
            if (row != null) {
                response_json.push({ 'path_email': username + '@nitt.edu', 'status': 'INITIATED REQUEST', 'time': row.getDataValue('time') });


            }
            let rows = await database.CertificatePaths.findAll({
                attributes: ['path_email', 'updatedAt', 'status'],
                where: {
                    certificate_id: id
                }
            });
            rows.forEach(function (ele) {
                response_json.push({
                    'status': ele.getDataValue('status'),
                    'path_email': ele.getDataValue('path_email'),
                    'time': ele.getDataValue('updatedAt')
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

module.exports = student