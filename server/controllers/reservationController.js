const utils = require("../utils/utils");
const Reservation = require("../models/reservationModel")


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
            .then((result)=>{
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
    }
}
