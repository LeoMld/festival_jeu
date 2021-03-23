
const utils = require("../utils/utils");
const Reservation = require("../models/reservationModel")

module.exports={
    getReservations: async (req,res)=>{
        const idFestival = await utils.getFestivalToDisplay(req)
        console.log(idFestival)
        await Reservation.getFestivalReservations(idFestival)
            .then((result)=>{
                console.log(result)
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
            console.log("Ok")
        }else{
            let colName = Object.keys(body)[0]
            let value= body[colName]
            console.log(colName)
            console.log(value)
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
