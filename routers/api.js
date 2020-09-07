const api  = require('express').Router()

const middlewares = require('../utils/middlewares')
const studentsRouter = require('./student');
const adminRouter = require('./admin')

api.use('/', middlewares.jwt_verify);
api.use('/admin', adminRouter);
api.use('/student', studentsRouter);



module.exports = api;