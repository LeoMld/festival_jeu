const Festival = require('../models/festivalModel')

module.exports = {
    // The client wants to see the festivals
    getAllFestivals : (req,res) => {
        Festival.retrieveFestivals().then(result => {
            res.status(200).json(result)
        }).catch((err) => {
            res.status(503).json({error: "Une erreur est survenue, veuillez réessayer."})
        })
    },

    // The client wants to update the current festival
    changeCurrentFestival : (req,res) => {
        const idFestival = req.params.id
        Festival.changeCurrentFestival(idFestival).then(result => {
            res.status(200).json({success : true})
        }).catch((err) => {
            res.status(503).json({error: "Une erreur est survenue, veuillez réessayer."})
        })
    }
}