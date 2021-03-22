const express = require('express');
const router = express.Router();

const token = require('../utils/token')
const UserController = require('../controllers/userController')

router.use(token.privateRoute);

router.get('/festival', UserController.getFestivalToDisplay)
router.put('/festival', UserController.changeFestivalUser)

module.exports = router;