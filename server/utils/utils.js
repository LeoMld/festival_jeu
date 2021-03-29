const usersModel = require("../models/utilisateurModel");
const jwt = require("./token");

module.exports = {
    sendErrorNumber: (req, res, varName) => {
        res.status(400).json({
            error: {
                name: varName + " is not a Number.",
                source: varName
            }
        })
    },

    // Retrieve the id of the festival to display for the user
    getFestivalToDisplay: async (req) => {
        const idUtilisateur = await jwt.getId(req.headers.authorization)
        const noFestival = 0
        return await usersModel.retrieveFestivalUser(idUtilisateur)
            .then((festivalToSee) => {
                // In case there is no current festival
                if (festivalToSee === undefined || festivalToSee.idFestival === null) {
                    festivalToSee = {idFestival: noFestival, nameFestival: "Festival non reconnu"}
                } else {
                    festivalToSee = festivalToSee
                }
                return festivalToSee
            })
    }
}
