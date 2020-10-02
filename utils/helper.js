require('dotenv').config({ path: '../env/.env' })

const uuid = require('uuid');
const multer = require('multer');
const database = require('../database/database')
const fs = require('fs')
const nodemailer = require('nodemailer');
const MulterError = multer.MulterError
const error_messages = require('./errorHandle')


const mailTransporter = nodemailer.createTransport({ 
    service: 'gmail',    
    auth: { 
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASS
    } 
}); 

const errorHandle = (status_code,message,res) => {
    return res.status(status_code).json({success:false,message:message})
}


function renameFile(oldPath, newPath){
    fs.renameSync(oldPath, newPath, (err)=>{
        if(err) throw err;
    })
}

const docFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(docx|DOCX|doc|DOC|pdf|PDF)$/)) {
        req.fileValidationError = 'Only pdf and doc files are allowed!';
        cb(new MulterError("Only pdf and doc files allowed"), false);

    }
    cb(null, true);
};

function validate_mail(path) {
    for (index in path) {

        let words = path[index].split('@');
        if (words[words.length - 1] != 'nitt.edu')
            return false;

    }
    return true;
}

async function approve_decline_rights(req, res, certificate_id) {
    let rollno = req.jwt_payload.username;
    let path_ids = await database.CertificatePaths.findAll({
        attributes: ['path_email', 'path_no', 'status'],
        where: {
            certificate_id
        }
    })
    let path_array = []
    path_ids.forEach(function (ele) {
        path_array.push({
            'no': ele.getDataValue('path_no'),
            'email': ele.getDataValue('path_email'),
            'status': ele.getDataValue('status')
        });
    });

    let flag = false;
    let current_verified = -1;
    path_array.forEach(function (ele) {
        if (ele.email == (rollno + '@nitt.edu')) {
            flag = true;
            current_verified = ele.no;
        }
    });

    if (!flag) {
        res.status(401).json({ 'message': 'You do not have appropriate permissions to approve or reject this certificate' });
        return false;
    }


    path_array.forEach(function (ele) {
        if (ele.no < current_verified && ele.status.includes("PENDING"))
            flag = false;
    })

    if (!flag) {
        res.status(400).json({ 'message': 'Faculty before you has not approved/rejected.' });
        return false;
    }
    path_array.forEach(function (ele) {
        if (ele.no > current_verified && !(ele.status.includes("PENDING"))) {
            res.status(400).json({ 'message': 'Faculty after you have already approved/declined.' })
            return false;
        }
    });
    return true;

}

function get_extension(file){
    let extension_array = file.originalname.split('.');
    return extension_array[extension_array.length - 1];
}

function check_compulsory(dict, keys){
    for(const key of keys){
        console.log(key)
        if(!dict[key])
        return false;
    }
    return true;

}

const storage = multer.diskStorage({
    destination: 'temp/',
    filename: function (req, file, cb) {
        let extension = get_extension(file);
        cb(null, uuid.v4() + "." + extension);
    }
});

module.exports =  {
    docFilter, storage, approve_decline_rights, validate_mail, renameFile, mailTransporter, check_compulsory, errorHandle
}
