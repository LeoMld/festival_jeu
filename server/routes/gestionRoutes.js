const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const festivalController = require('../controllers/festivalController');
const contactController = require("../controllers/contactController");
const zoneController = require("../controllers/zoneController");
const personController = require("../controllers/personController");
const reservationController = require("../controllers/reservationController")
const jeuPresentController = require("../controllers/jeuPresentController")
const token = require('../utils/token')

router.get("/reservations", reservationController.getReservations)
router.get("/reservations/:id", reservationController.getAReservation)
router.put("/reservations/:id", reservationController.updateReservation)


router.use(token.privateRoute);

router.get('/festival', festivalController.getAllFestivals)
router.post('/festival', festivalController.createFestival)
router.put('/festival', festivalController.updateNameFestival)
router.put('/festival/:id', festivalController.changeCurrentFestival)

router.get('/editeurs/', personController.getAllEditors)
router.post('/editeurs/', personController.createPerson)
router.get('/editeurs/:id', personController.getPersonPage)
router.put('/editeurs/:id', personController.updatePerson)

router.get('/exposants/', personController.getAllExposants)
router.post('/exposants/', personController.createPerson)
router.get('/exposants/:id', personController.getPersonPage)
router.put('/exposants/:id', personController.updatePerson)

router.get('/personnes', personController.getAllPersons)
router.get("/personne/:id", personController.getPerson)

router.post('/contact', contactController.createContact)
router.put('/contact/:id', contactController.updateContact)
router.delete('/contact/:id', contactController.deleteContact)

router.get('/zone', zoneController.getAllZonesFestival)
router.post('/zone/', zoneController.createNewZone)
router.put('/zone/:id', zoneController.updateZone)
router.delete('/zone/:id', zoneController.deleteZone)

router.put('/jeuPresent', jeuPresentController.changeZoneJeuPresent)


module.exports = router;
