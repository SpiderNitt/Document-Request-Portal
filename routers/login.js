const webmail_auth_url = 'https://spider.nitt.edu/~praveen/auth_json.php';

const jwt = require('jsonwebtoken')
const login = require('express').Router()


login.post('/', async function (req, res) {
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

module.exports = login;