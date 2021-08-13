const api = require("express").Router();

const middlewares = require("../utils/middlewares");
const studentsRouter = require("./student");
const adminRouter = require("./admin");

api.use("/", middlewares.jwt_verify);
api.use("/admin", adminRouter);
api.use("/student", studentsRouter);

api.get('/status', (req, res) => {
	return res.status(200).json({ Success: true });
});

module.exports = api;
