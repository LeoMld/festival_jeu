const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const gestionController = require('../controllers/gestionController');
const contactController = require("../controllers/contactController");
const zoneController = require("../controllers/zoneController");
const personController = require("../controllers/personController");

router.get('/AllFestivals', gestionController.getAllFestivals)


router.get('/editeurs/', personController.getAllEditors)
router.get('/editeurs/:id', personController.getEditorPage)


router.post('/contact', contactController.createContact)
router.put('/contact/:id', contactController.updateContact)
router.delete('/contact/:id', contactController.deleteContact)

router.post('/zone/', zoneController.createNewZone)
router.put('/zone/:id', zoneController.updateZone)
router.delete('/zone/:id', zoneController.deleteZone)

module.exports = router;
