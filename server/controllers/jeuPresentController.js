const Zone = require('../models/zoneModel')
const JeuPresent = require('../models/jeuPresentModel')
const Person = require('../models/personModel')
const utils = require("../utils/utils");

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
    },

    // Retrieve all the games in the festival for each editor
    getAllGamesEditeur: async (req, res) => {
        try {
            const idFestival = await utils.getFestivalToDisplay(req)
            const editors = await Person.getEditeurs()
            // Will contain the editors and their games of the current festival
            const data = []
            for (let i = 0; i < editors.length; i++) {
                const games = await JeuPresent.getGamesReservedEditor(editors[i].idPersonne, idFestival)
                console.log(editors[i].nomPersonne)
                // We only keep the editors with games on the festival
                if (games.length !== 0) {
                    const editor = editors[i]
                    editor.games = games
                    data.push(editor)
                }
            }
            console.log(data)
            res.status(200).json(data)
        } catch (err) {
            console.log(err)
            res.status(503).json()
        }
    }
}