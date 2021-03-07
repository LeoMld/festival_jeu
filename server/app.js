const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// We import all the routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// This is all our routes on the back-end
app.use('/api', indexRouter);
app.use('/users', usersRouter);

module.exports = app;