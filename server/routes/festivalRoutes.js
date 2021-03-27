const express = require('express');
const router = express.Router();

const festivalController = require('../controllers/festivalController');
const token = require('../utils/token')

router.use(token.privateRouteAdminOrga);

router.get('/', festivalController.getAllFestivals)

router.use(token.privateRouteAdmin)

router.post('/', festivalController.createFestival)
router.put('/', festivalController.updateNameFestival)
router.put('/:id', festivalController.changeCurrentFestival)

module.exports = router;