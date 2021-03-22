const jwt = require('../utils/token')
const usersModel = require("../models/utilisateurModel")
const Utils = require("../utils/utils")

module.exports = {

    // Retrieve the festival to display of the user
    getFestivalToDisplay: (req, res) => {
        Utils.getFestivalToDisplay(req)
            .then((festivalToSee) => {
                res.status(200).json({idFestival: festivalToSee})
            })
            .catch(() => {
                res.status(503).json()
            })
    },

    // We update the festival to see of the user asking
    changeFestivalUser: async (req, res) => {
        const idUtilisateur = await jwt.getId(req.headers.authorization)
        const idFestival = req.body.idFestival
        usersModel.changeFestivalUser(idUtilisateur, idFestival)
            .then(() => {
                res.status(200).json()
            })
            .catch(() => {
                res.status(503).json()
            })
    }
}