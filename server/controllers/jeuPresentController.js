const Zone = require('../models/zoneModel')

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
                // TODO
                res.json()
            }).catch((err) => {
            // An error occured
            res.status(503).json()
        })
    }
}