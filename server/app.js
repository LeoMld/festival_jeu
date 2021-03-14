const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    // We use our local variable environments
    require('dotenv').config();
}
else {
    // TODO We are in production
}

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());



// We import all the routes
const homeRoutes = require('./routes/homeRoutes');
const game = require('./models/jeuxModel')
game.getAllGames().then(r =>{
    console.log(r)
})
//game.modifyTypeJeu(1, "puzzle")
//game.createTypeGame("action")
//game.createJeu("Super jeu", 2, 12, "3-4 semaines",false,1,1);
//game.modifyJeu("Super jeuqsdsqdqd", 2, 12, "3-4 semaines",false,1,1,3)

// This is all our routes on the back-end
app.use('/api', homeRoutes);

module.exports = app;