const Zone = require('../models/zoneModel')
const JeuPresent = require('../models/jeuPresentModel')
module.exports = {
    // Update the game in the zone
    changeZoneJeuPresent: (req, res) => {
        const idJeu = req.body.idJeu
        const idZone = req.body.idZone
        const idReservation = req.body.idReservation
        const idNewZone = req.body.idNewZone
        const idFestival = req.body.idFestival
        Zone.changeZoneJeuPresent(idZone, idJeu, idReservation, idNewZone, idFestival)
            .then(() => {
                // All is fine
                res.status(200).json()
            }).catch(() => {
            // An error occured
            res.status(503).json()
        })
    },

    // Update the price of the game
    changePrixRenvoi: (req, res) => {
        const idJeu = req.params.id
        const idReservation = req.body.idReservation
        const idZone = req.body.idZone
        const prixRenvoi = req.body.prixRenvoi
        JeuPresent.updatePrixRenvoi(idJeu, idZone, idReservation, prixRenvoi)
            .then(() => {
                res.status(200).json()
            })
            .catch((err) => {
                console.log(err)
                // An error occured
                res.status(503).json()
            })
    },

    // Add a game in the reservation
    addJeuPresent: (req, res) => {
        const idJeu = req.body.idJeu
        const idZone = req.body.idZone
        const idReservation = req.body.idReservation
        const prixRenvoi = req.body.prixRenvoi
        console.log("here")
        JeuPresent.addGameReservation(idJeu, idZone, idReservation, prixRenvoi)
            .then((newGame) => {
                res.status(201).json(newGame)
            })
            .catch((err) => {
                console.log(err)
                res.status(503).json()
            })
    },

    // Delete a game from the reservation
    deleteJeuPresent: (req, res) => {
        const idJeu = req.body.idJeu
        const idZone = req.body.idZone
        const idReservation = req.body.idReservation
        JeuPresent.deleteGameReservation(idJeu, idZone, idReservation)
            .then(() => {
                res.status(200).json()
            })
            .catch((err) => {
                console.log(err)
                res.status(503).json()
            })
    }
}