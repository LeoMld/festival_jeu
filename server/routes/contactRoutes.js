const express = require('express');
const router = express.Router();

const contactController = require("../controllers/contactController");
const token = require('../utils/token')

router.use(token.privateRouteAdmin)

router.post('/', contactController.createContact)
router.put('/:id', contactController.updateContact)
router.delete('/:id', contactController.deleteContact)

module.exports = router;