const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const festivalController = require('../controllers/festivalController');
const contactController = require("../controllers/contactController");
const zoneController = require("../controllers/zoneController");
const personController = require("../controllers/personController");
const reservationController = require("../controllers/reservationController")
const noteController = require("../controllers/noteController")
const jeuPresentController = require("../controllers/jeuPresentController")
const token = require('../utils/token')

router.get("/jeuxEditeur", jeuPresentController.getAllGamesEditeur)
router.get('/zone', zoneController.getAllZonesFestival)
router.get("/reservations", reservationController.getReservations)
router.get("/reservations/:id", reservationController.getAReservation)
router.put("/reservations/:id", reservationController.updateReservation)
router.post("/notes", noteController.createNote)
router.put("/notes/:id", noteController.updateNote)

router.use(token.privateRouteAdminOrga);

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

router.post('/zone/', zoneController.createNewZone)
router.put('/zone/:id', zoneController.updateZone)
router.delete('/zone/:id', zoneController.deleteZone)

router.put('/jeuPresent', jeuPresentController.changeZoneJeuPresent)
router.put('/jeuPresent/:id', jeuPresentController.changePrixRenvoi)
router.post('/jeuPresent', jeuPresentController.addJeuPresent)
router.delete('/jeuPresent', jeuPresentController.deleteJeuPresent)

router.put('/espacesReserves/:id', reservationController.updateEmplacementsReservation)
router.post('/espacesReserves', reservationController.saveNewEmplacements)

module.exports = router;
