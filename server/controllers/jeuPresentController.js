const Zone = require('../models/zoneModel')
const JeuPresent = require('../models/jeuPresentModel')
const utils = require("../utils/utils");
const async = require("async")

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
        JeuPresent.addGameReservation(idJeu, idZone, idReservation, prixRenvoi)
            .then((newGame) => {
                res.status(201).json(newGame)
            })
            .catch((err) => {
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
                res.status(503).json()
            })
    },

    // Retrieve all the games in the festival for each editor
    getAllGamesEditeur: async (req, res) => {
        try {
            const idFestival = (await utils.getFestivalToDisplay(req)).idFestival
            /*
            const editors = await Person.getEditeurs()
             */
            // Will contain the editors and their games of the current festival
            let result = []

            const games = await JeuPresent.getGamesReservedEditor(idFestival)
            // We retrieve the editors here, and assign them their games
            const data = await utils.editorGames(games)
            await async.forEachOf(data, async(editor) => {
                const newResult = utils.zonesGames(editor.games)
                editor.games = newResult
                for (let j = 0; j < newResult.length; j++) {
                    editor.games[j].nomPersonne = editor.nomPersonne
                }
                result.push(editor)
            })
            res.status(200).json(result)
        } catch (err) {
            res.status(503).json()
        }
    }
}