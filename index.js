require('dotenv').config({ path: './env/.env' })

const express = require('express')
const fs = require('fs')
const axios = require('axios')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bodyParser = require('body-parser');
const { MulterError } = require('multer');
const database = require('./database/database')
const uuid = require('uuid');
const morgan = require('morgan')
const { CertificatePaths, Certificate } = require('./database/database');
const cors = require('cors');

const app = express()
const webmail_auth_url = 'https://spider.nitt.edu/~praveen/auth_json.php';
const port = process.env.PORT || 3001
const secret = process.env.JWT_SECRET;


//#region HELPER UTILS
const jwt_verify = function (req, res, next) {
    try {
        const auth_header = req.header('Authorization');
        const token = auth_header.substring(7);
        console.log(token);
        const decoded = jwt.verify(token, secret);
        req.jwt_payload = decoded.data;
        next();
    } catch (err) {
        res.status(403).json({ 'message': 'Invalid Token or nonexistent header' });
        return;

    }
}

const is_admin = function (req, res, next) {
    let rollno = req.jwt_payload.username;
    let isnum = /^\d+$/.test(rollno);
    req.is_admin = false;
    if (isnum) {
        res.status(403).json({ 'message': 'You do not have appropriate admin permissions.' })
        return;
    }
    else {
        req.is_admin = true;
        next();
    }
}

const docFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(docx|DOCX|doc|DOC|pdf|PDF)$/)) {
        req.fileValidationError = 'Only pdf and doc files are allowed!';
        cb(new MulterError("Only pdf and doc files allowed"), false);

    }
    cb(null, true);
};

async function approve_decline_rights(req, res, certificate_id) {
    let rollno = req.jwt_payload.username;
    let path_ids = await CertificatePaths.findAll({
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
    console.log("this is current verified::: ", current_verified);

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



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        let extension_array = file.originalname.split('.');
        let extension = extension_array[extension_array.length - 1];
        cb(null, uuid.v4() + "." + extension);
    }
});

function validate_mail(path) {
    // console.log(path)
    for (index in path) {
        if (path[index] != '') {
            let words = path[index].split('@');
            if (words[words.length - 1] != 'nitt.edu')
                return false;
        }
    }
    return true;
}
//#endregion

//#region MIDDLEWARE REGISTRATION

app.use(cors())
// app.use(bodyParser.text());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', jwt_verify);
app.use('/api/admin', is_admin);

//#endregion

//#region  LOGIN
app.post('/login', async function (req, res) {
    const { username, password } = req.body;
    const data = {
        rollno: username,
        password,
    };
    if (process.env.ENV == 'DEV') {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),   // 1 month
            data: { username }
        },
            process.env.JWT_SECRET
        );
        res.status(200).json({ "message": "Success", token });
    }
    else {
        let response = await axios.post(webmail_auth_url, data);

        if (response.data == 1) {
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),   // 1 month
                data: { username }
            },
                process.env.JWT_SECRET
            );
            res.status(200).json({ "message": "Success", token });
        }
        else {
            res.status(401).json({ "message": "Invalid username/password Combination" })
        }
    }

})
//#endregion


//#region STUDENT
app.post("/api/certificate_request", async function (req, res) {
    const upload = multer({ storage: storage, fileFilter: docFilter }).single('certificate');
    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return res.status(400).json({ 'message': req.fileValidationError });
        }
        else {
            console.log("REQ FILES:::? ", req.files);
            let filename = req.file.filename;
            let { type, path } = req.body;
            path = path.split(',');
            console.log("JSON::: ", path);
            console.log("path??", path)
            let applier_roll = req.jwt_payload.username;
            let status = "PENDING VERIFICATION"
            try {
                if (!validate_mail(path)) {
                    res.status(400).json({ 'message': 'All mail IDs must end with nitt.edu' })
                    return;
                }
                let response = await database.Certificate.create({ type, applier_roll, file: filename, status });

                let certificate_id = response.getDataValue('id');
                let time = new Date(Date.now()).toISOString();
                status = "INITIATED REQUEST"
                await database.History.create({ certificate_id, time, status })
                for (index in path) {
                    CertificatePaths.create({ certificate_id, path_no: parseInt(index) + 1, path_email: path[index], path_name: path[index], status: 'PENDING' })
                }

                res.status(200).json({ 'message': 'Requested Successfully' })
            }
            catch (err) {
                console.log(err)
                res.status(400).json({ 'message': 'Invalid Data' })
            }


            // return res.status(400).json({ 'message': 'Only pdf and doc files allowed' })
        }

    })
})

app.get("/api", async function (req, res) {
    // console.log(req.jwt_payload);
    let rollno = req.jwt_payload.username;
    let rows = await Certificate.findAll({
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

app.get('/api/certificate_download', async function (req, res) {

    let id = parseInt(req.query.id);
    // console.log("this is id: ", id)
    let rollno = req.jwt_payload.username;
    let row = await Certificate.findOne({
        attributes: ['file'],
        where: {
            applier_roll: rollno,
            id
        }
    });
    console.log(row);
    if (row == null)
        res.status(403).json({ "message": "You do not have appropriate permissions to access this resource." })
    else {
        let filename = row.getDataValue('file');
        // console.log("filename::: ", filename)
        res.status(200).sendFile(__dirname + '/uploads/' + filename);
    }


})

app.get('/api/certificate_history', async function (req, res) {
    try {
        let { id } = req.query;
        let { username } = req.jwt_payload;
        let id_exists = await Certificate.findOne({
            attributes: ['id'],
            where:{
                id,
                applier_roll: username
            }
           
        });
        if(id_exists == null){
            res.status(403).json({'message': "You do not have the appropriate permissions to access the resource."})
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
                response_json.push({'path_email': username + '@nitt.edu', 'status': 'INITIATED REQUEST', 'time': row.getDataValue('time')});

              
            }
            let rows = await database.CertificatePaths.findAll({
                attributes: ['path_email', 'updatedAt', 'status'],
                where:{
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
//#endregion

app.post('/api/admin/approve', async function (req, res) {

    const upload = multer({ storage: storage, fileFilter: docFilter }).single('certificate')


    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return res.status(400).json({ 'message': req.fileValidationError });
        }
        else {
            if (!req.file) {
                res.status(400).json({ 'message': 'Please upload a file' });
            }
            else {


                let { certificate_id } = req.body;
                let rollno = req.jwt_payload.username;
                let flag = await approve_decline_rights(req, res, certificate_id);
                if (!flag) {
                    fs.unlinkSync(__dirname + "/" + req.file.filename);
                    console.log("file deleted successfully");
                    return; ``
                }

                else {
                    let filename = req.file.filename;
                    let status = rollno + "@nitt.edu APPROVED";
                    try {
                        let row = await database.Certificate.findOne({
                            attributes: ['file'],
                            where: {
                                id: certificate_id
                            }
                        })
                        let old_filename = row.getDataValue('file');
                        fs.unlinkSync(__dirname + "/uploads/" + old_filename);
                        console.log("file deleted successfully");

                        await database.Certificate.update({ file: filename, status }, {
                            where: {
                                id: certificate_id
                            }
                        });
                        await database.CertificatePaths.update({ status: 'APPROVED' }, {
                            where: {
                                certificate_id,
                                path_email: rollno + "@nitt.edu"
                            }
                        })
                        await database.History.create({ certificate_id, status, time: new Date(Date.now()).toISOString() })
                        res.status(200).json({ 'message': "Approved successfully" });
                    }
                    catch (err) {
                        console.log(err);
                        res.status(500).json({ 'message': "There was some error uploading the file. Try again later" });

                    }
                }
            }
        }
    });




});


app.post('/api/admin/decline', multer().none(), async function (req, res) {
    let { certificate_id } = req.body;
    let rollno = req.jwt_payload.username;
    let flag = await approve_decline_rights(req, res, certificate_id);
    if (flag) {
        try {
            let status = rollno + "@nitt.edu DECLINED";
            await database.Certificate.update({ status }, {
                where: {
                    id: certificate_id
                }
            });
            await database.CertificatePaths.update({ status: 'DECLINED' }, {
                where: {
                    certificate_id,
                    path_email: rollno + "@nitt.edu"
                }
            })
            await database.History.create({ certificate_id, status, time: new Date(Date.now()).toISOString() })
            res.status(200).json({ 'message': "Declined successfully" });

        }
        catch (err) {
            console.log(err);
            res.status(500).json({ 'message': "There was some error declining the file. Try again later" });

        }

    }
})

app.get("/api/admin", async function (req, res) {
    try {
        let rollno = req.jwt_payload.username;


        // find all ids for which dude is the admin
        let path_details = await database.CertificatePaths.findAll({
            attributes: ['certificate_id', 'path_no', 'status'],
            where: {
                path_email: rollno + '@nitt.edu'
            }
        });
        let path_objects = []
        path_details.forEach(function (ele) {
            let path_no = ele.getDataValue('path_no');
            let certificate_id = ele.getDataValue('certificate_id');
            let status = ele.getDataValue('status')
            path_objects.push({
                path_no, certificate_id, status
            })
        })
        let response_json = []
        console.log("PATH OBJECTS:: ? ", path_objects)
        for (const index in path_objects) {
            let path_object = path_objects[index];
            console.log("path object? ", path_object)
            let { path_no, certificate_id, status } = path_object;
            console.log("this is cert if::: ", certificate_id)

            if (path_no == 1 && status === 'PENDING') {
                const ele = await database.Certificate.findOne({
                    attributes: ['applier_roll', 'type'],
                    where: {
                        id: certificate_id
                    }
                })
                response_json.push({
                    applier_roll: ele.getDataValue('aplier_roll'),
                    certificate_type: ele.getDataValue('type'),
                    certificate_id,
                    status
                })
            }
            else if (path_no != 1) {
                const row = await database.CertificatePaths.findOne({
                    where: {
                        path_no: path_no - 1,
                        status: 'APPROVED',
                        id: certificate_id
                    }
                });
                if (row != null) {
                    const ele = await database.Certificate.findOne({
                        attributes: ['applier_roll', 'type'],
                        where: {
                            id: certificate_id
                        }
                    })
                    response_json.push({
                        applier_roll: ele.getDataValue('aplier_roll'),
                        certificate_type: ele.getDataValue('type'),
                        certificate_id,
                        status
                    })
                }

            }

        }
        res.status(200).json(response_json);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ 'message': 'Some issue with the server. Try again later' })
    }

});

app.listen(port, function () {
    console.log("llistening on port " + port)
})
