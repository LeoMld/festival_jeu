const token = require("../utils/token");

const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const gameController = require('../controllers/gameController');


router.get('/', gameController.getAllGames)

router.use(token.privateRoute);

router.get('/TypesJeux', gameController.getTypesJeux)
router.post('/TypesJeux', gameController.createType)
router.delete('/TypesJeux/:id', gameController.deleteType)

router.post('/', gameController.createGame)


router.put('/:id', gameController.handleGame)
router.get('/:id', gameController.getGame)

router.delete('/:id', gameController.deleteGame)

module.exports = router;
