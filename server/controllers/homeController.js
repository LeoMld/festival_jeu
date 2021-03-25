const usersModel = require("../models/utilisateurModel")
const bcrypt = require('bcrypt');
const jwt = require('../utils/token')

module.exports = {

    //get the state of an user an send it to the client
    getStatus: async (req, res) => {
        const status = await jwt.getStatus(req.headers.authorization)
        res.status(200).json(status)
    },

    //check the parameters of an user, generate the token and send it to the client
    login: async (req, res) => {
        let data = {exist: false, match: false}

        //sanitize the request
        const email = req.sanitize(req.body.email);
        const password = req.sanitize(req.body.password);

        //search if the user exist
        try {
            const user = await usersModel.searchUser(email)
            let token = null

            //if an user exist
            if (user[0]) {
                data.exist = true
                const match = await bcrypt.compare(password, user[0].mdpUtilisateur);
                if (match) {
                    data.match = true

                    token = await jwt.connect(req, res, user[0].idUtilisateur, user[0].typeUtilisateur)
                    //if it's the good password
                    data.type = user[0].typeUtilisateur
                    res.status(200).json({token: token, data: data})
                } else {
                    res.status(401).json({token: token, data: data})
                }
            } else {
                res.status(401).json({token: token, data: data})
            }
        } catch (err) {
            res.status(503).json({error: err})
        }

    }
}
