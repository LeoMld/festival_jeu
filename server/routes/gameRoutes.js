const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const gameController = require('../controllers/gameController');

router.get('/', gameController.getAllGames)

router.put('/:id', gameController.handleGame)

module.exports = router;
