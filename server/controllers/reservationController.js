const utils = require("../utils/utils");
const Reservation = require("../models/reservationModel")
const Emplacement = require("../models/emplacementModel")


module.exports={
    getReservations: async (req,res)=>{
        const idFestival = await utils.getFestivalToDisplay(req)
        await Reservation.getFestivalReservations(idFestival)
            .then((result)=>{
                res.status(200).json(result)
            })
            .catch((e)=>{
                res.status(503).json(e)
            })
    },
    getAReservation : async (req,res)=>{
        let id=req.params.id
        await Reservation.getAReservation(id)
            .then(async (result)=>{
                // We retrieve the emplacements of a festival
                result.emplacements = await Emplacement.retrieveEmplacements(result.FK_idFestival)
                res.status(200).json(result)
            })
            .catch((e)=>{
                res.status(503).json(e)
            })
    },

    updateReservation : async (req,res)=>{
        body=req.body
        if(body.remiseReservation){
            //update the whole reservation
        }else{
            console.log(body)
            let colName = Object.keys(body)[0]
            let value= body[colName]
            await Reservation.updateSingleCol(req.params.id,colName,value)
                .then((result)=>{
                    res.status(200).json(result.rowCount)
                })
                .catch((e)=>{
                    res.status(503).json(e)
                })
        }
    },

    saveNewEmplacements : async (req,res)=>{
        // TODO créer les espaces réservés
        // TODO update la remise et le prix
    }
}
