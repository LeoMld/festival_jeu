const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const gestionController = require('../controllers/gestionController');

router.get('/AllFestivals', gestionController.getAllFestivals)

module.exports = router;