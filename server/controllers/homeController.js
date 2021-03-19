const usersModel = require("../models/utilisateurModel")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('../utils/token')


module.exports = {
    home: async (req,res) => {
        res.json({ response : "Yes, it works, thanks." })
    },

    getStatus : async (req,res)=>{
        console.log(req.body.token)
        const status = await jwt.getStatus(req.body.token)
        console.log(status)
        res.status(200).json({type : status})
    },

    login : async (req, res)=>{
        let data = {exist : false,match : false, type : 2}

        //sanitize the request
        const email = req.sanitize(req.body.email);
        const password = req.sanitize(req.body.password);

        //search if the user exist
        try{
            const user = await usersModel.searchUser(email)
            let token = null

            //if an user exist
            if(user[0]){
                data.exist = true
                const match = await bcrypt.compare(password, user[0].mdpUtilisateur);
                //if it's the good password
                if(match){

                    data.match = true
                    token = await jwt.connect(req,res,user[0].idUtilisateur,user[0].typeUtilisateur)
                    data.type = user[0].typeUtilisateur
                    res.status(200).json({token : token,data : data})
                }else{
                    res.status(200).json({token : token,data : data})
                }
            }else{
                res.status(200).json({token : token,data : data})
            }
        }catch (err){
            res.status(503).json({error: err})
        }

    },

}
