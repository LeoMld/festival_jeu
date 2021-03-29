const jeux = require("../models/jeuxModel")
const utils = require("../utils/utils");

const changePrototype= async (req,res) => {

    await jeux.modifyPrototypeJeu(req.params.id, req.body.bool).then(result => {
        res.status(200).json(true)
    }).catch((error)=>{
        res.status(503).json({error: error})
    })

}

const changeAllFields = async (req,res) =>{

    await jeux.modifyJeu(req.body.game.libelleJeu,req.body.game.nombreJoueur,req.body.game.ageMinimum,req.body.game.duree,req.body.game.prototype,req.body.game.FK_idPersonne,req.body.game.FK_idTypeJeu,req.body.game.idJeu).then(result => {
        res.status(200).json(true)
    }).catch((error)=>{
        res.status(503).json({error: error})
    })

}

module.exports = {

    //return all the games
    getAllGames: async (req,res) => {
        await jeux.getAllGames().then(result => {
            if(result.length===0){
                res.status(200).json([])
            }else{
                res.status(200).json(result)

            }
        }).catch((error)=>{
            res.status(503).json({error: error})
        })

    },

    //return all the games of the current festival
    getAllGamesFestivalCourant: async (req,res) => {
        const idFest = (await utils.getFestivalToDisplay(req)).idFestival
        await jeux.getAllGamesCurrentFestival(idFest).then(result => {
            if(result.length===0){
                res.status(200).json([])
            }else{
                res.status(200).json(result)

            }
        }).catch((error)=>{
            res.status(503).json({error: error})
        })

    },
    //return all the games
    getGame: async (req,res) => {
        await jeux.getGame(req.body.idJeu).then(result => {
            if(result.length===0){
                res.status(200).json('No game')
            }else{
                res.status(200).json({data:result})

            }
        }).catch((error)=>{
            res.status(503).json({error: error})
        })

    },

    //return all the types of games
    getTypesJeux: async (req,res) => {
        await jeux.getTypesJeux().then(result => {
            if(result.length===0){
                res.status(200).json('No types')
            }else{
                res.status(200).json({data:result})

            }
        }).catch((error)=>{
            res.status(503).json({error: error})
        })

    },




    handleGame: async (req,res) => {
        try{
            //si il y a un jeu dans la requête, cela indique que l'on veut modifier tout le jeu
            if(req.body.game){
                await changeAllFields(req, res)
            }else{
                await changePrototype(req, res)
            }
        }catch (err){
            res.status(503).json({error: err})
        }

    },

    deleteGame : async (req,res)=>{
        try{
            await jeux.deleteJeu(req.params.id)
            res.status(200).json('game deleted')
        }catch (err){
            res.status(503).json({error: err})
        }
    },

    deleteType : async (req,res)=>{
        try{
            await jeux.deleteType(req.params.id)
            res.status(200).json('type deleted')
        }catch (err){
            res.status(503).json({error: err})
        }
    },

    //Create a game
    createGame: async (req,res)=>{
        try{
            const body = req.body;
            let ageMinimum = parseInt(body.game.ageMinimum);
            let FK_idPersonne = parseInt(body.game.FK_idPersonne);
            let FK_idTypeJeu = parseInt(body.game.FK_idTypeJeu);
            if(isNaN(ageMinimum)){
                utils.sendErrorNumber(req,res,Object.keys({FK_idTypeJeu})[0])
            }
            else if(isNaN(FK_idPersonne)){
                utils.sendErrorNumber(req,res,Object.keys({FK_idPersonne})[0])
            }
            else if(isNaN(ageMinimum)){
                utils.sendErrorNumber(req,res,Object.keys({ageMinimum})[0])
            }
            else{

                jeux.createJeu(body.game.libelleJeu,body.game.nombreJoueur,ageMinimum,body.game.duree,body.game.prototype,FK_idTypeJeu,FK_idPersonne)
                    .then((result)=>{
                        res.status(201).json({inserted:true,idJeu:result})
                    }).catch((error)=>{
                    console.log(error)
                        res.status(503).json({
                            error:error,
                            inserted:false
                        })
                    })
            }
        }catch (err){
            res.status(503).json({error: err})
        }

    },
    //Create a game
    createType: async (req,res)=>{
        try{
            const body = req.body
            if(body.newType.length < 1){
                res.status(400).json({error: "Veuillez insérer un type"})
            }else{
                await jeux.createTypeGame(body.newType)
                    .then(()=>{
                        res.status(201).json({inserted:true})
                    }).catch((error)=>{
                        res.status(503).json({
                            error:error,
                            inserted:false
                        })
                    })
            }


        }catch (err){
            res.status(503).json({error: err})
        }

    },


}
