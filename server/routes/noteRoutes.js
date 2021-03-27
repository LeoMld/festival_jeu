const express = require('express');
const router = express.Router();

const noteController = require("../controllers/noteController")
const token = require('../utils/token')

router.use(token.privateRouteAdmin);

router.post("/", noteController.createNote)
router.put("/:id", noteController.updateNote)

module.exports = router;