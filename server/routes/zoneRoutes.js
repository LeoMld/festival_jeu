const express = require('express');
const router = express.Router();

const zoneController = require("../controllers/zoneController");
const token = require('../utils/token')

router.get('/', zoneController.getAllZonesFestival)

router.use(token.privateRouteAdmin)

router.post('/', zoneController.createNewZone)
router.put('/:id', zoneController.updateZone)
router.delete('/:id', zoneController.deleteZone)

module.exports = router;
