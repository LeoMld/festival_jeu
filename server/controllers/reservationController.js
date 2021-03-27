const utils = require("../utils/utils");
const Reservation = require("../models/reservationModel")
const Emplacement = require("../models/emplacementModel")
const Person = require("../models/personModel")
const EspaceReserve = require("../models/espaceReserveModel")
const Zone = require("../models/zoneModel");

module.exports = {
    getReservations: async (req, res) => {
        const idFestival = await utils.getFestivalToDisplay(req)
        await Reservation.getFestivalReservations(idFestival)
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((e) => {
                res.status(503).json(e)
            })
    },
    getAReservation: async (req, res) => {
        let id = req.params.id
        await Reservation.getAReservation(id)
            .then(async (result) => {
                // We retrieve the emplacements of a festival
                result.emplacements = await Emplacement.retrieveEmplacements(result.FK_idFestival)
                // We retrieve the zones of the festival
                result.zones = await Zone.getAFestivalZones(result.FK_idFestival)
                res.status(200).json(result)
            })
            .catch((e) => {
                res.status(503).json(e)

            })
    },
    createNewReservations : async(req,res)=>{
        try{
            let idFestival = await utils.getFestivalToDisplay(req)
            console.log(idFestival)
            console.log("OK")
            const personnes = await Person.getPersonsWithoutReservations(idFestival)
            if(personnes.length===0){
                res.status(200).json({data:"No Reservations to create"})

            }else{
                console.log(personnes)
                for (const p of personnes) {
                    await Reservation.createPersonReservation(idFestival,p.idPersonne)
                }
                await Reservation.getFestivalReservations(idFestival)
                    .then((result) => {
                        res.status(200).json(result)
                    })
                    .catch((e) => {
                        res.status(503).json(e)
                    })
            }
        }catch (e){
            res.status(503).json(e)
        }
    },

    updateReservation: async (req, res) => {
        let body = req.body
        let colName = Object.keys(body)[0]
        let value = body[colName]
        await Reservation.updateSingleCol(req.params.id, colName, value)
            .then((result) => {
                res.status(200).json(result.rowCount)
            })
            .catch((e) => {
                res.status(503).json(e)
            })

    },

    // Create new reserved spaces for a reservation
    saveNewEmplacements: async (req, res) => {
        try {
            const idReservation = req.body.idReservation
            const espacesReserves = req.body.inputsEspaces
            const remiseReservation = req.body.remiseReservation
            const prixReservation = req.body.prixReservation
            const newEspacesReserves = await EspaceReserve.createSeveralEspacesReserves(espacesReserves, idReservation)
            // We update the discount
            await Reservation.updateSingleCol(idReservation, "remiseReservation", parseFloat(remiseReservation))
            // We update the price
            await Reservation.updateSingleCol(idReservation, "prixReservation", parseFloat(prixReservation))
            res.status(201).json(newEspacesReserves)
        } catch (err) {
            res.status(503).json()
        }
    },

    // Update the spaces, price and discount for a reservation
    updateEmplacementsReservation: async (req, res) => {
        try {
            let idReservation = req.params.id
            const espacesReserves = req.body.inputsEspaces
            const remiseReservation = req.body.remiseReservation
            const prixReservation = req.body.prixReservation
            // We update all the reserved spaces
            await EspaceReserve.updateSeveralReservedSpaces(espacesReserves)
            // We update the discount
            await Reservation.updateSingleCol(idReservation, "remiseReservation", parseFloat(remiseReservation))
            // We update the price
            await Reservation.updateSingleCol(idReservation, "prixReservation", parseFloat(prixReservation))
            res.status(200).json()
        } catch (err) {
            res.status(503).json()
        }
    }
}
