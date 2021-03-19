const Festival = require('../models/festivalModel')
const Emplacement = require('../models/emplacementModel')
const EspaceReserve = require('../models/espaceReserveModel')
const Reservation = require('../models/reservationModel')

const FestivalUtils = require('../utils/festivalUtils')
const Format = require('../utils/formatNumber')

module.exports = {

    // The client wants to see the festivals, we send all the info he needs
    getAllFestivals: async (req, res) => {
        try {
            // All the festivals
            const festivals = await Festival.retrieveFestivals()
            // Then all the emplacements of each festival
            let emplacements
            for (let i = 0; i < festivals.length; i++) {
                // We retrieve the emplacements of the festival
                emplacements = (await Emplacement.retrieveEmplacements(festivals[i].idFestival))
                festivals[i].emplacements = emplacements
                // Now we retrieve the reserved spaces from each emplacements
                let reservedSpaces
                let numberTables
                let numberSquareMeters
                let numberTablesTotal = 0
                let numberTablesReservedTotal = 0
                let numberSquareMetersReservedTotal = 0
                let availableTotal = 0
                for (let j = 0; j < emplacements.length; j++) {
                    numberTablesTotal += emplacements[j].nombreTablesPrevues
                    reservedSpaces = (await EspaceReserve.retrieveReservedSpaces(emplacements[j].idEmplacement))
                    // Now we calculate how much tables and square meters reserved we have for each emplacement
                    numberTables = 0
                    numberSquareMeters = 0
                    for (let z = 0; z < reservedSpaces.length; z++) {
                        numberTables += reservedSpaces[z].nombreTables
                        numberTablesReservedTotal += reservedSpaces[z].nombreTables
                        numberSquareMeters += reservedSpaces[z].metreCarres
                        numberSquareMetersReservedTotal += reservedSpaces[z].metreCarres
                    }
                    festivals[i].emplacements[j].numberTables = Format.formatDouble(numberTables)
                    festivals[i].emplacements[j].numberSquareMeters = Format.formatDouble(numberSquareMeters)

                    festivals[i].emplacements[j].availableTables = Format.formatDouble(emplacements[j].nombreTablesPrevues -
                        (numberTables + (numberSquareMeters / 6)))
                    availableTotal += emplacements[j].nombreTablesPrevues -
                        (numberTables + (numberSquareMeters / 6))
                }
                // The totals recap for the festival
                festivals[i].numberTablesReservedTotal = Format.formatDouble(numberTablesReservedTotal)
                festivals[i].numberSquareMetersReservedTotal = Format.formatDouble(numberSquareMetersReservedTotal)
                festivals[i].numberTablesTotal = Format.formatDouble(numberTablesTotal)
                festivals[i].availableTotal = Format.formatDouble(availableTotal)
                festivals[i].priceReservationTotal = (await Reservation.retrievePaidReservations(festivals[i].idFestival))
            }
            res.status(200).json(festivals)
        } catch (err) {
            // An error occured
            res.status(503).json()
        }
    },

    // The client wants to update the current festival
    changeCurrentFestival: (req, res) => {
        const idFestival = req.params.id
        Festival.changeCurrentFestival(idFestival).then(() => {
            res.status(200).json()
        }).catch(() => {
            res.status(503).json()
        })
    },

    // The client wants to create a new festival
    createFestival: (req, res) => {
        const body = req.body
        const nameFestival = body.nameFestival
        const emplacements = body.emplacements
        // We check if everything is ok
        const err = FestivalUtils.checkFestivalInput(nameFestival, emplacements)
        if (err.generalStatus === 0) {
            // All good, we create the festival
            Festival.createFestival(nameFestival, emplacements)
                .then((newFest) => {
                    const newFestival = newFest
                    // We put the initial info the user wants to know
                    newFestival.numberTablesReservedTotal = 0
                    newFestival.numberSquareMetersReservedTotal = 0
                    let numberTablesTotal = 0
                    for (let i = 0; i < newFestival.emplacements.length; i++) {
                        newFestival.emplacements[i].numberTables = 0
                        newFestival.emplacements[i].numberSquareMeters = 0
                        newFestival.emplacements[i].availableTables = newFestival.emplacements[i].nombreTablesPrevues
                        numberTablesTotal += newFestival.emplacements[i].availableTables
                    }
                    newFestival.numberTablesTotal = numberTablesTotal
                    newFestival.availableTotal = numberTablesTotal
                    newFestival.priceReservationTotal = (0).toFixed(2)
                    // We send it to the client
                    res.status(200).json({
                        generalStatus: err.generalStatus,
                        newFestival
                    })
                })
                .catch(() => {
                    res.status(503).json()
                })
        } else {
            res.status(200).json(err)
        }
    },

    // The client wants to change the name of a festival
    updateNameFestival: (req, res) => {
        const body = req.body
        const nameFestival = body.nameFestival
        const idFestival = body.idFestival
        const err = FestivalUtils.checkFestivalName(nameFestival)
        if (!err) {
            // The name is correct, we update
            Festival.updateNameFestival(idFestival, nameFestival)
                .then(() => {
                    // All good, we tell the client
                    res.status(200).json({
                        generalStatus: 0
                    })
                })
                .catch(() => {
                    res.status(503).json()
                })
        } else {
            // Name invalid
            res.status(200).json({generalStatus: 1})
        }
    }
}