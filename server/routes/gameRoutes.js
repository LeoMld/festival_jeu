const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const gameController = require('../controllers/gameController');

router.get('/allGames', gameController.getAllGames)
router.put('/changePrototype', gameController.changePrototype)
router.put('/changeGame', gameController.changeGame)

module.exports = router;
