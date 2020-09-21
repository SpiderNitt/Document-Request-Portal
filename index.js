require('dotenv').config({ path: './env/.env' })

const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const path = require('path');
global.appRoot = path.resolve(__dirname);

const app = express()
const port = process.env.PORT || 3001

const fs = require('fs')

const apiRouter = require('./routers/api')
const loginRouter = require('./routers/login')

app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', apiRouter);
app.use('/login', loginRouter);

try {


    fs.mkdir(__dirname + "/temp");
    fs.mkdir(__dirname + "/uploads");
   
}
catch {
    // console.log(err);
}
app.listen(port, function () {
    console.log("llistening on port " + port)
})
