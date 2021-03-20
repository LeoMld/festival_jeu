const usersModel = require("../models/utilisateurModel")
const Festival = require("../models/festivalModel")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('../utils/token')

module.exports = {
    home: async (req, res) => {
        res.json({response: "Yes, it works, thanks."})
    },

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
                //if it's the good password
                if (match) {
                    data.match = true
                    token = jwt.connect(req, res, user[0].idUtilisateur, user[0].typeUtilisateur)
                    res.status(200).json({token: token, data: data})
                } else {
                    res.status(200).json({token: token, data: data})
                }
            } else {
                res.status(200).json({token: token, data: data})
            }
        } catch (err) {
            res.status(503).json({error: err})
        }

    },

    // Retrieve the festival to display of the user
    getFestivalToDisplay: (req, res) => {
        // TODO check le token, avec le token on a l'id utilisateur
        // Si hors ligne => on récupère le festival courant
        // Si en ligne, on récupère celui de l'utilisateur
        const status = 1
        const noFestival = {idFestival: 0}
        switch (status) {
            case 1:
            case 0:
                // User connected
                usersModel.retrieveFestivalUser(1)
                    .then((festivalToSee) => {
                        // In case there is no current festival
                        if (festivalToSee.idFestival === null) {
                            festivalToSee = noFestival
                        }
                        res.status(200).json(festivalToSee)
                    })
                    .catch(() => {
                        // An error occured
                        res.status(503).json()
                    })
                break;
            // User not connected
            default:
                Festival.retrieveCurrentFestival()
                    .then((festivalToSee) => {
                        // In case there is no current festival
                        if (festivalToSee.idFestival === null) {
                            festivalToSee = noFestival
                        }
                        res.status(200).json(festivalToSee)
                    })
                    .catch(() => {
                        // An error occured
                        res.status(503).json()
                    })
        }
    }
}
