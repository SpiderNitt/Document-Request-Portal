const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "../env/.env" });

const createJWT = async(rollNo) => {
  try {
    
    if (rollNo) {
      return jwt.sign({
          roll: rollNo,
        },
        process.env.JWT_SECRET, { expiresIn: "720h" }
      );
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyJWT = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
      // eslint-disable-next-line camelcase
      req.jwt_payload = decoded;
      if (err) {
        if (err.name && err.name === "TokenExpiredError") {
          return res.status(403).json({ message: "Token expired" });
        }
        return res
          .status(401)
          .json({ message: "Invalid token or Token expired" });
      }
      return next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error: " });
  }
};
module.exports = { createJWT, verifyJWT };