const jwt = require('../utils/token')
const usersModel = require("../models/utilisateurModel")
const Utils = require("../utils/utils")
const bcrypt = require("bcrypt");

module.exports = {

    // Retrieve the festival to display of the user
    getFestivalToDisplay: async (req, res) => {
        Utils.getFestivalToDisplay(req)
            .then((festivalToSee) => {
                res.status(200).json({idFestival: festivalToSee})
            })
            .catch(() => {
                res.status(503).json()
            })
    },

    // Retrieve all the organisateurs
    getOrganisateurs: async (req, res) => {
        usersModel.getAllOrganisateurs()
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((e) => {
                console.log(e)
                res.status(503).json()
            })
    },

    // add an new organisateur
    addOrganisateur: async (req, res) => {
        let pwd = req.body.mdpUtilisateur
        const nom = req.body.nomUtilisateur
        const prenom = req.body.prenomUtilisateur
        const mail = req.body.mailUtilisateur
        const type = 0

        if(!pwd){
            pwd = " "
        }
        bcrypt.hash(pwd, 10, function(err, hash) {
            usersModel.addUser(nom,prenom,mail,hash,type)
                .then((id) => {
                    res.status(200).json(id)
                })
                .catch((e) => {
                    console.log(e)
                    res.status(503).json()
                })
        })

    },
    // Delete an organisateur
    deleteOrganisateur: async (req, res) => {
        const id = req.params.id
        usersModel.deleteOrganisateur(id)
            .then(() => {
                res.status(200).json({deleted:true})
            })
            .catch((e) => {
                console.log(e)
                res.status(503).json()
            })
    },

    // We update the festival to see of the user asking
    changeFestivalUser: async (req, res) => {
        const idUtilisateur = await jwt.getId(req.headers.authorization)
        const idFestival = req.body.idFestival
        usersModel.changeFestivalUser(idUtilisateur, idFestival)
            .then(() => {
                res.status(200).json()
            })
            .catch(() => {
                res.status(503).json()
            })
    },
    // We update the mail,name,surname of an user
    modifyProfile: async (req, res) => {
        const idUtilisateur = await jwt.getId(req.headers.authorization)
        const nom = req.sanitize(req.body.nom)
        const prenom = req.sanitize(req.body.prenom)
        const email = req.sanitize(req.body.mail)
        let pwd = req.sanitize(req.body.pwd)

        const user = await usersModel.searchUser(email)

        if(!pwd){
            pwd= " "
        }

        const match = await bcrypt.compare(pwd, user[0].mdpUtilisateur);
        if(match){
            usersModel.changeInfosUser(idUtilisateur, nom,prenom,email)
                .then(() => {
                    res.status(200).json()
                })
                .catch((err) => {
                    console.log(err)
                    res.status(503).json()
                })
        }else{
            res.status(401).json()
        }

    },
    // We update the mail and password
    modifyPassword: async (req, res) => {
        const idUtilisateur = await jwt.getId(req.headers.authorization)
        let newPwd = req.sanitize(req.body.newPwd)
        let OldPwd = req.sanitize(req.body.OldPwd)


        const user = await usersModel.searchPwdUser(idUtilisateur)

        if(!OldPwd){
            OldPwd= " "
        }

        const match = await bcrypt.compare(OldPwd, user.mdpUtilisateur);
        if(match){
            bcrypt.hash(newPwd, 10, function(err, hash) {
                if(err){
                    res.status(503).json()
                }else{
                    usersModel.changePwdUser(idUtilisateur, hash)
                        .then(() => {
                            res.status(200).json()
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(503).json()
                        })
                }

            });

        }else{
            res.status(401).json()
        }

    },

    //get the profile of an user
    getProfile: async (req,res)=>{
        usersModel.searchUserByID(req.params.id).then((data)=>{
            res.status(200).json(data)
            })
            .catch((err)=>{
                res.status(503).json(err)
            })
    }
}
