const express = require('express');
const router = express.Router();

// We import the controller of the homeRoutes routes
const homeController = require('../controllers/homeController');
const gameController = require("../controllers/gameController");

router.get('/', homeController.home)


router.get('/', homeController.home)



module.exports = router;
