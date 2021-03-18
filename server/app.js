const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSanitizer = require('express-sanitizer');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    // We use our local variable environments
    require('dotenv').config();
}
else {
    // TODO We are in production
}

app.use(expressSanitizer());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());



// We import all the routes
const homeRoutes = require('./routes/homeRoutes');
const gestionRoutes = require('./routes/gestionRoutes')
const gameRoutes = require('./routes/gameRoutes')

// This is all our routes on the back-end
app.use('/api/', homeRoutes);
app.use('/api/gestion/',gestionRoutes);
app.use('/api/games/',gameRoutes);

module.exports = app;
