const jwt = require('jsonwebtoken')



const jwt_verify = function (req, res, next) {
    try {
        const auth_header = req.header('Authorization');
        const token = auth_header.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.jwt_payload = decoded.data;
        next();
    } catch (err) {
        console.log(err)
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



module.exports =  {
    is_admin, jwt_verify
}