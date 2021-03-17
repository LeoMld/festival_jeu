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
        console.log(req.body.game)
        await jeux.modifyPrototypeJeu(req.body.game.idJeu, req.body.game.prototype).then(result => {
            res.status(200).json(true)
        }).catch((error)=>{
            res.status(503).json({error: error})
        })

    }


}
