const Zone = require("../models/zoneModel");
const utils = require("../utils/utils");
module.exports = {
    createNewZone : async (req,res)=>{
        let body = req.body;
        let idFestival = params.idFestival
        if(isNaN(idFestival)){
            utils.sendErrorNumber(req,res,idFestival,Object.keys({idFestival})[0])
        }else{
            await Zone.createNewZone(body.libelleZone,idFestival)
                .then(()=>{
                    res.status(201).json({inserted:true})
                })
                .catch((error)=>{
                    res.status(503).json({
                        error:error,
                        insert:false
                    })
                })
        }
    },
    updateZone : async (req,res)=>{
        let params = req.params;
        let idZone = params.id
        let body = req.body
        if(isNaN(idZone)){

            utils.sendErrorNumber(req,res,idZone,Object.keys({idZone})[0])
        }else{
            await Zone.updateZone(idZone,body.libelleZone)
                .then(()=>{
                    res.status(201).json({updated:true})
                })
                .catch(error=>{
                    res.status(503).json({
                        error:error,
                        updated:false
                    })
                })
        }
    },
    deleteZone : async (req,res)=>{
        let idZone = req.params.id
        if(isNaN(idZone)){
            utils.sendErrorNumber(req,res,idZone,Object.keys({idZone})[0])
        }
        else{
            await Zone.deleteZone(idZone)
                .then(()=>{
                    res.status(201).json({deleted:true})

                }).catch((error)=>{
                    res.status(503).json({
                        error:error,
                        deleted:false
                    })
                })
        }
    }
}
