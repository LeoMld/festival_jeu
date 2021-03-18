const jeux = require("../models/jeuxModel")

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

    //change prototype of a game
    changePrototype: async (req,res) => {

        await jeux.modifyPrototypeJeu(req.body.game.idJeu, req.body.game.prototype).then(result => {
            res.status(200).json(true)
        }).catch((error)=>{
            res.status(503).json({error: error})
        })

    },

    //change all fields of a game
    changeGame: async (req,res) => {
        await jeux.modifyJeu(req.body.game.libelleJeu,req.body.game.nombreJoueur,req.body.game.ageMinimum,req.body.game.duree,req.body.game.prototype,req.body.game.FK_idPersonne,req.body.game.FK_idTypeJeu,req.body.game.idJeu).then(result => {
            res.status(200).json(true)
        }).catch((error)=>{
            res.status(503).json({error: error})
        })

    }


}
