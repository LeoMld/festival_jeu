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
 //-----------------ORGANISATEURS------------------
    //Get all organisateurs
    getAllOrganisateurs: async () => {
        const clientUsed = await DB.getPoolClient()
        const queryText = `SELECT "idUtilisateur","nomUtilisateur","prenomUtilisateur","mailUtilisateur"
                           FROM "Utilisateur"
                           WHERE "typeUtilisateur" = $1;`
        let result = await clientUsed.query(queryText, [0])

        return result.rows
    },
    //Delete an organisateur with his id
    deleteOrganisateur: async (id, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `DELETE FROM "Utilisateur"
                           WHERE "idUtilisateur" = $1;`
        await clientUsed.query(queryText, [id])

    },
    //Add a new user
    addUser: async (nomUtilisateur, prenomUtilisateur, mailUtilisateur, mdpUtilisateur, typeUtilisateur, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Utilisateur" ("nomUtilisateur","prenomUtilisateur","mailUtilisateur","mdpUtilisateur","typeUtilisateur") VALUES ($1,$2,$3,$4,$5) RETURNING "idUtilisateur";'
        const queryValues = [nomUtilisateur, prenomUtilisateur, mailUtilisateur, mdpUtilisateur, typeUtilisateur]
        return (await clientUsed.query(text, queryValues)).rows[0].idUtilisateur
    },


    //---------------------FESTIVALS-----------------
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
        const queryText = 'SELECT "FK_idFestival" AS "idFestival", "nameFestival"  FROM "Utilisateur" JOIN "Festival" ON "idFestival"="Utilisateur"."FK_idFestival" WHERE "idUtilisateur" = $1;'
        const queryValues = [idUtilisateur]
        let festivalToSee = (await clientUsed.query(queryText, queryValues)).rows[0]
        // If it's null, it's automatically the current one
        if (festivalToSee === undefined || festivalToSee.idFestival === null) {
            festivalToSee = await Festival.retrieveCurrentFestival()
        }
        return festivalToSee
    }
}
