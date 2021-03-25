const usersModel = require("../models/utilisateurModel")
const bcrypt = require('bcrypt');
const token = require('../utils/token')
const jwt = require('jsonwebtoken');
module.exports = {

    //get the state of an user an send it to the client
    getStatus: async (req, res) => {
        const status = await token.getStatus(req.headers.authorization)
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
            let jwtToken = null

            //if an user exist
            if (user[0]) {
                data.exist = true
                const match = await bcrypt.compare(password, user[0].mdpUtilisateur);
                if (match) {
                    data.match = true
                    console.log(user)
                    jwtToken = await token.connect(user[0].idUtilisateur, user[0].typeUtilisateur)
                    //if it's the good password
                    const refreshToken = await token.createRefreshToken(user[0].idUtilisateur, user[0].typeUtilisateur)
                    //put exp time afer tested
                    data.type = user[0].typeUtilisateur
                    res.status(200).json({token: jwtToken, refreshToken : refreshToken,data: data})
                } else {
                    res.status(401).json({token: jwtToken, data: data})
                }
            } else {
                res.status(401).json({token: jwtToken, data: data})
            }
        } catch (err) {
            res.status(503).json({error: err})
        }

    },
    refreshToken : async (req,res) =>{
        const refreshToken = req.body.token
        console.log(req.body)
        if (refreshToken == null) return res.status(401).json({logged:false})
        //verif if token is already used
        //if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, user) => {
            if (err) return res.status(403).json({logged:false})
            const accessToken = await token.connect(user.userId, user.type)
            const refreshToken = await token.createRefreshToken(user.userId, user.type)

            res.status(201).json({ accessToken: accessToken,refreshToken : refreshToken })
        })
    }
}
