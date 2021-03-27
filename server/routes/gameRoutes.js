const token = require("../utils/token");

const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const gameController = require('../controllers/gameController');

router.get('/FestivalCourant', gameController.getAllGamesFestivalCourant)
router.get('/', gameController.getAllGames)

router.use(token.privateRouteAdminOrga);

router.get('/:id', gameController.getGame)

router.use(token.privateRouteAdmin);

router.get('/TypesJeux', gameController.getTypesJeux)
router.post('/TypesJeux', gameController.createType)
router.delete('/TypesJeux/:id', gameController.deleteType)
router.post('/', gameController.createGame)
router.put('/:id', gameController.handleGame)
router.delete('/:id', gameController.deleteGame)

module.exports = router;
