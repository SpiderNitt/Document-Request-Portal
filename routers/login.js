const webmail_auth_url = 'https://spider.nitt.edu/~praveen/auth_json.php';

const axios = require('axios')
const jwt = require('jsonwebtoken')
const login = require('express').Router()

const admin_allowlist = ['abcspider', 'defspider', 'ghispider', 'jklspider', 'mnospider']

login.post('/', async function (req, res) {
    const { username, password } = req.body;
    const data = {
        rollno: username,
        password,
    };
    let flag = false;
    // If DEV env or allowList in PROD
    if (process.env.ENV == 'DEV' || (process.env.ENV == 'PROD' && admin_allowlist.includes(username))) {
        flag = true;
    }
    else {

        let response = await axios.post(webmail_auth_url, data);

        if (response.data == 1) {
            flag = true;
        }
    }


    if (flag) {
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
})

module.exports = login;