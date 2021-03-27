const express = require('express');
const cors = require('cors');
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSanitizer = require('express-sanitizer');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    // We use our local variable environments
    require('dotenv').config();
} else {
    // We are in production
    app.use(express.static(path.join(__dirname, '../client/build')))
}

app.use(expressSanitizer());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// We import all the routes
const homeRoutes = require('./routes/homeRoutes');
const jeuxPresentsRoutes = require('./routes/jeuxPresentsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const exposantsRoutes = require('./routes/exposantsRoutes');
const editeursRoutes = require('./routes/editeursRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const espaceReserveRoutes = require('./routes/espaceReserveRoutes');
const noteRoutes = require('./routes/noteRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes')

// This is all our routes on the back-end
app.use('/api/', homeRoutes);
app.use('/api/gestion/jeuPresent', jeuxPresentsRoutes);
app.use('/api/gestion/zone', zoneRoutes);
app.use('/api/gestion/contact', contactRoutes);
app.use('/api/gestion/festival', festivalRoutes);
app.use('/api/gestion/exposants', exposantsRoutes);
app.use('/api/gestion/editeurs', editeursRoutes);
app.use('/api/gestion/reservations', reservationRoutes);
app.use('/api/gestion/espacesReserves', espaceReserveRoutes);
app.use('/api/gestion/notes', noteRoutes);
app.use('/api/games/', gameRoutes);
app.use('/api/user/', userRoutes)

app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

module.exports = app;
