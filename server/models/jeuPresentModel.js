const DB = require('../config/config')

// Contains all the queries to the database concerning games in reservations
module.exports = {

    setZoneToDefault: async (idZoneDefault, idZone, client) => {
        const clientUsed = DB.getPoolClient(client)
        const queryText = 'UPDATE "JeuPresent" SET "PK_idZone" = $2, "estPlace" = false WHERE "PK_idZone" = $1;'
        const queryValues = [idZone, idZoneDefault]
        clientUsed.query(queryText, queryValues)
    }
}