const express = require('express');
const router = express.Router();

const token = require('../utils/token')
const UserController = require('../controllers/userController')

router.use(token.privateRouteAdminOrga);

router.get('/profile/:id', UserController.getProfile)
router.put('/profile', UserController.modifyProfile)
router.put('/profile/pwd', UserController.modifyPassword)

router.get('/festival', UserController.getFestivalToDisplay)
router.put('/festival', UserController.changeFestivalUser)

router.use(token.privateRouteAdmin);

router.get('/Organisateurs', UserController.getOrganisateurs)
router.post('/Organisateurs', UserController.addOrganisateur)
router.delete('/Organisateurs/:id', UserController.deleteOrganisateur)

module.exports = router;
