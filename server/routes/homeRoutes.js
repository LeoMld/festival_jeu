const express = require('express');
const router = express.Router();

// We import the controller of the homeRoutes routes
const homeController = require('../controllers/homeController');

router.get('/', homeController.home)

module.exports = router;