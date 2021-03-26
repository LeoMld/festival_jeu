const Zone = require("../models/zoneModel");
const JeuPresent = require("../models/jeuPresentModel")
const Jeu = require("../models/jeuxModel")
const Person = require("../models/personModel")
const Reservation = require("../models/reservationModel")
const utils = require("../utils/utils");

module.exports = {

    // Retrieve all the zones of a festival
    getAllZonesFestival: async (req, res) => {
        try {
            const idFestival = await utils.getFestivalToDisplay(req)
            const zones = await Zone.getAFestivalZones(idFestival)
            // We need the games in each zones
            for (let i = 0; i < zones.length; i++) {
                // We retrieve the reserved games for each zone
                zones[i].games = await JeuPresent.getGamesReserved(zones[i].idZone)
                for (let j = 0; j < zones[i].games.length; j++) {
                    // And now the info of all those games
                    const game = await Jeu.getGame(zones[i].games[j].PK_idJeu)
                    zones[i].games[j].libelleJeu = game[0].libelleJeu
                    zones[i].games[j].nombreJoueur = game[0].nombreJoueur
                    zones[i].games[j].ageMinimum = game[0].ageMinimum
                    zones[i].games[j].duree = game[0].duree
                    zones[i].games[j].prototype = game[0].prototype
                    // The type of the game
                    const typeGame = await Jeu.getTypeJeu(game[0].FK_idTypeJeu)
                    zones[i].games[j].libelleTypeJeu = typeGame.libelleTypeJeu
                    // The editor of the game
                    const editor = await Person.getPerson(game[0].FK_idPersonne)
                    zones[i].games[j].nomPersonne = editor.nomPersonne
                    // We retrieve the reservation
                    const reservation = await Reservation.getReservation(zones[i].games[j].PK_idReservation)
                    zones[i].games[j].besoinAnimateurReservation = reservation.besoinAnimateurReservation
                    zones[i].games[j].jeuxRecuReservation = reservation.jeuxRecuReservation
                }
            }
            res.status(200).json(zones)

        } catch (err) {
            // An error occured
            res.status(503).json()
            console.log(err)
        }
    },

    // Create a new zone for the given festival with the given name
    createNewZone: async (req, res) => {
        try {
            const body = req.body;
            const idFestival = await utils.getFestivalToDisplay(req)
            const nameZone = body.libelleZone
            // We check the length of the zone
            if (nameZone.length > 2 && nameZone.length < 50) {
                // It's okay, we create the zone
                const newZone = await Zone.createNewZone(nameZone, idFestival)
                res.status(201).json({
                    status: 0,
                    newZone
                })
            } else {
                // Not good
                res.status(200).json({
                    status: 1
                })
            }
        } catch (err) {
            // An error occured
            res.status(503).json()
        }
    },

    // The client wants to update a zone
    updateZone: async (req, res) => {
        try {
            const idZone = req.params.id
            const body = req.body
            const libelleZone = body.libelleZone
            if (libelleZone.length > 2 && libelleZone.length < 50) {
                // All good
                await Zone.updateZone(idZone, libelleZone)
                res.status(200).json({
                    status: 0
                })
            } else {
                // Not good
                res.status(200).json({
                    status: 1
                })
            }
        } catch (err) {
            // An error occured
            res.status(503).json()
        }
    },

    // The client wants to delete a zone
    deleteZone: async (req, res) => {
        try {
            let idZone = req.params.id
            let idFestival = req.body.idFestival
            await Zone.deleteZone(idZone, idFestival)
            res.status(200).json()
        } catch (err) {
            // An error occured
            res.status(503).json()
        }
    }
}
