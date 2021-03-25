const DB = require('../config/config')

// Contains all the queries to the database concerning games in reservations
module.exports = {

    // We put all the reserved games in the zone given into the default zone
    setZoneToDefault: async (idZoneDefault, idZone, client) => {
        const clientUsed = DB.getPoolClient(client)
        const queryText = 'UPDATE "JeuPresent" SET "PK_idZone" = $2, "estPlace" = false WHERE "PK_idZone" = $1;'
        const queryValues = [idZone, idZoneDefault]
        clientUsed.query(queryText, queryValues)
    },

    // Retrieve the games reserved of a zone
    getGamesReserved: async (idZone, client) => {
        const clientUsed = DB.getPoolClient(client)
        const queryText = 'SELECT * from "JeuPresent" WHERE "PK_idZone" = $1 ORDER BY "derniereModification" DESC;'
        const queryValues = [idZone]
        return (await clientUsed.query(queryText, queryValues)).rows
    },

    updateEstPlace: async (idJeu, idZone, idReservation, val, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `UPDATE "JeuPresent" SET "estPlace" = '${val}' WHERE "PK_idReservation" = '${idReservation}'
        AND "PK_idJeu" = '${idJeu}' AND "PK_idZone" = '${idZone}';`
        return await clientUsed.query(queryText, [])
    },
    getReservationGames: async (idReservation, client) => {
        const clientUsed = DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "JeuPresent" JOIN "Jeu" ON "Jeu"."idJeu"="JeuPresent"."PK_idJeu" JOIN "TypeJeu" ON "TypeJeu"."idTypeJeu"="Jeu"."FK_idTypeJeu" JOIN "Personne" ON "Jeu"."FK_idPersonne"="Personne"."idPersonne" WHERE "JeuPresent"."PK_idReservation"=$1;'
        const queryValues = [idReservation]
        return (await clientUsed.query(queryText, queryValues)).rows
    },
    //retrieve games with prixRenvoi != 0 for a reservation
    getFactureGames: async (idReservation, client) => {
        const clientUsed = DB.getPoolClient(client)
        const queryText = 'SELECT SUM("prixRenvoi") as prixRenvoiTotal FROM "JeuPresent" WHERE "PK_idReservation"=$1'
        const queryValues = [idReservation]
        return (await clientUsed.query(queryText, queryValues)).rows[0]
    }
}
