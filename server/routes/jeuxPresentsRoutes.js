const express = require('express');
const router = express.Router();

const jeuPresentController = require("../controllers/jeuPresentController")
const token = require('../utils/token')

router.get("/editeur", jeuPresentController.getAllGamesEditeur)

router.use(token.privateRouteAdmin)

router.put('/', jeuPresentController.changeZoneJeuPresent)
router.put('/:id', jeuPresentController.changePrixRenvoi)
router.post('/', jeuPresentController.addJeuPresent)
router.delete('/', jeuPresentController.deleteJeuPresent)

module.exports = router;
