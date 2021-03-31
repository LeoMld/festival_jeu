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
    },

    // Regroup the same games that are in a different zone
    zonesGames: (result) => {
        let newResult = []
        let idsDone = []
        let i = 0
        let idJeu
        while (i !== result.length) {
            idJeu = result[i].idJeu
            // Already done ?
            if (!idsDone.includes(idJeu)) {
                idsDone.push(idJeu)
                // We retrieve all similar games
                const games = result.filter(value => value.idJeu === idJeu)
                let game = result[i]
                game.zones = []
                // We add the zones to the game
                for (let z = 0; z < games.length; z++) {
                    game.zones.push(games[z].libelleZone)
                }
                newResult.push(game)
            }
            i++
        }
        return newResult
    }
}
