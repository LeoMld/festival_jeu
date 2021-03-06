const Zone = require("../models/zoneModel");
const JeuPresent = require("../models/jeuPresentModel")
const utils = require("../utils/utils");
const async = require("async")

module.exports = {

    // Retrieve all the zones of a festival
    getAllZonesFestival: async (req, res) => {
        try {
            const idFestival = (await utils.getFestivalToDisplay(req)).idFestival
            const zones = await Zone.getAFestivalZones(idFestival)
            // We need the games in each zones
            await async.forEachOf(zones, async (zone, i) => {
                // We retrieve the reserved games for each zone
                zones[i].games = await JeuPresent.getGamesReservedZone(zones[i].idZone)
            })
            res.status(200).json(zones)
        } catch (err) {
            // An error occured
            res.status(503).json()
        }
    },

    // Create a new zone for the given festival with the given name
    createNewZone: async (req, res) => {
        try {
            const body = req.body;
            const idFestival = (await utils.getFestivalToDisplay(req)).idFestival
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
