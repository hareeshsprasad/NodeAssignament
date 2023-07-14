import express from 'express';
var bodyParser = require('body-parser')
const fileUpload = require("express-fileupload")
const path = require('path')
const util = require('util')
var cors = require('cors')
const app = express();
const Config = require('config');
const port = Config.get('port');
import apiRouter from './src/router';
import {indexFunction} from './src/modules/index'

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(fileUpload());
app.use(cors());
app.use('/', apiRouter);
app.use('/',indexFunction);

/* for log api request start */
import morganBody from 'morgan-body';
morganBody(app);
/* for log api request end */
// app.use(express.static('public')); 
// app.use('/uploads', express.static('uploads/productImage'));


app.listen(port, ()=>{
    console.log(`Connected successfully on port ${port}`)
})