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
    }
}