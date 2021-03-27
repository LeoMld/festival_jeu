const express = require('express');
const router = express.Router();

const personController = require("../controllers/personController");
const token = require('../utils/token')

router.use(token.privateRouteAdminOrga);

router.get('/', personController.getAllEditors)
router.get('/:id', personController.getPersonPage)

router.use(token.privateRouteAdmin)

router.post('/', personController.createPerson)
router.put('/:id', personController.updatePerson)

module.exports = router;