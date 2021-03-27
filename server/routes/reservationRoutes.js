const express = require('express');
const router = express.Router();

const reservationController = require("../controllers/reservationController")
const token = require('../utils/token')

router.use(token.privateRouteAdminOrga);

router.get("/", reservationController.getReservations)
router.get("/:id", reservationController.getAReservation)

router.use(token.privateRouteAdmin)

router.put("/:id", reservationController.updateReservation)

module.exports = router;