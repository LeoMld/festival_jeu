const jeux = require("../models/jeuxModel")

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
                res.status(200).json('No games')
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

    }


}
