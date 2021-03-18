const Festival = require('../models/festivalModel')
const FestivalUtils = require('../utils/festivalUtils')

module.exports = {
    // The client wants to see the festivals
    getAllFestivals: (req, res) => {
        Festival.retrieveFestivals().then(result => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(503).json({error: "Une erreur est survenue, veuillez réessayer."})
        })
    },

    // The client wants to update the current festival
    changeCurrentFestival: (req, res) => {
        const idFestival = req.params.id
        Festival.changeCurrentFestival(idFestival).then(result => {
            res.status(200).json({success: true})
        }).catch((err) => {
            res.status(503).json({error: "Une erreur est survenue, veuillez réessayer."})
        })
    },

    // The client wants to create a new festival
    createFestival: (req, res) => {
        const body = req.body
        const nameFestival = body.nameFestival
        const emplacements = body.emplacements
        // We check if everything is ok
        const err = FestivalUtils.checkFestivalInput(nameFestival, emplacements)
        if (err.generalStatus == 0) {
            // All good, we create the festival
            Festival.createFestival(nameFestival, emplacements)
                .then((newFestival) => {
                    res.status(200).json({
                        generalStatus: err.generalStatus,
                        newFestival
                    })
                })
                .catch((err) => {
                    res.status(503).json({error: "Une erreur est survenue, veuillez réessayer."})
                })
        } else {
            res.status(200).json(err)
        }
    },

    updateFestival: (req, res) => {
        const body = req.body
        const nameFestival = body.nameFestival
        const idFestival = body.idFestival
        const err = FestivalUtils.checkFestivalName(nameFestival)
        if (!err) {
            // The name is correct, we update
            Festival.updateFestival(idFestival, nameFestival)
                .then(() => {
                    // All good, we tell the client
                    res.status(200).json({
                        generalStatus: 0
                    })
                })
                .catch((err) => {
                    res.status(503).json({error: "Une erreur est survenue, veuillez réessayer."})
                })
        } else {
            // Name invalid
            res.status(200).json({generalStatus: 1})
        }
    }
}