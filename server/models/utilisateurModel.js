const DB = require('../config/config')

const Festival = require('./festivalModel');


module.exports = {

    //Get an user
    searchUser: async (mail, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT *
                           FROM "Utilisateur"
                           WHERE "mailUtilisateur" = $1;`
        let result = await clientUsed.query(queryText, [mail])
        return result.rows
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
