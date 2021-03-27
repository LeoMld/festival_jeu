const express = require('express');
const router = express.Router();

const reservationController = require("../controllers/reservationController")
const token = require('../utils/token')

router.use(token.privateRouteAdmin);

router.put('/:id', reservationController.updateEmplacementsReservation)
router.post('/', reservationController.saveNewEmplacements)

module.exports = router;