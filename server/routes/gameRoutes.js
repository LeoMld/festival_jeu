const token = require("../utils/token");

const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const gameController = require('../controllers/gameController');


router.get('/', gameController.getAllGames)

router.use(token.privateRoute);

router.put('/:id', gameController.handleGame)

router.delete('/:id', gameController.deleteGame)

module.exports = router;
