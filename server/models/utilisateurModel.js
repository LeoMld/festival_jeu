const DB = require('../config/config')

const Festival = require('./festivalModel');


module.exports = {


    //Get an user by mail
    searchUser: async (mail, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT *
                           FROM "Utilisateur"
                           WHERE "mailUtilisateur" = $1;`
        let result = await clientUsed.query(queryText, [mail])
        return result.rows
    },

    //Get the password hashed of an user
    searchPwdUser: async (id, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT "mdpUtilisateur"
                           FROM "Utilisateur"
                           WHERE "idUtilisateur" = $1;`
        let result = await clientUsed.query(queryText, [id])
        return result.rows[0]
    },

    // Change infos of an user
    changeInfosUser: async (idUtilisateur,  nom,prenom,email) => {
        const clientUsed = await DB.getPoolClient()
        const queryText = 'UPDATE "Utilisateur" SET "nomUtilisateur" = $2,"prenomUtilisateur"=$3,"mailUtilisateur"=$4 WHERE "idUtilisateur" = $1;'
        const queryValues = [idUtilisateur,nom,prenom,email]
        clientUsed.query(queryText, queryValues)
    },

    // Change pwd of an user
    changePwdUser: async (idUtilisateur, pwd) => {
        const clientUsed = await DB.getPoolClient()
        const queryText = 'UPDATE "Utilisateur" SET "mdpUtilisateur" = $2 WHERE "idUtilisateur" = $1;'
        const queryValues = [idUtilisateur,pwd]
        clientUsed.query(queryText, queryValues)
    },

    //Get an user by id
    searchUserByID: async (id, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT "nomUtilisateur","prenomUtilisateur","mailUtilisateur"
                           FROM "Utilisateur"
                           WHERE "idUtilisateur" = $1;`
        let result = await clientUsed.query(queryText, [id])
        return result.rows[0]
    },

    // Change festival to see for a user
    changeFestivalUser: async (idUtilisateur, idFestival, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "Utilisateur" SET "FK_idFestival" = $1 WHERE "idUtilisateur" = $2;'
        const queryValues = [idFestival, idUtilisateur]
        clientUsed.query(queryText, queryValues)
    },


    // We retrieve the festival to see of a user
    retrieveFestivalUser: async (idUtilisateur, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT "FK_idFestival" AS "idFestival"  FROM "Utilisateur" WHERE "idUtilisateur" = $1;'
        const queryValues = [idUtilisateur]
        let festivalToSee = (await clientUsed.query(queryText, queryValues)).rows[0]
        // If it's null, it's automatically the current one
        if (festivalToSee === undefined || festivalToSee.idFestival === null) {
            festivalToSee = await Festival.retrieveCurrentFestival()
        }
        return festivalToSee
    }
}
