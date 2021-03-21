const jwt = require('../utils/token')
const usersModel = require("../models/utilisateurModel")

module.exports = {

    // Retrieve the festival to display of the user
    getFestivalToDisplay: async (req, res) => {
        const idUtilisateur = await jwt.getId(req.headers.authorization)
        const noFestival = {idFestival: 0}
        usersModel.retrieveFestivalUser(idUtilisateur)
            .then((festivalToSee) => {
                // In case there is no current festival
                if (festivalToSee === undefined || festivalToSee.idFestival === null) {
                    festivalToSee = noFestival
                }
                res.status(200).json(festivalToSee)
            })
            .catch(() => {
                // An error occured
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