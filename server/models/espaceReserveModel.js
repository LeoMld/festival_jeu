const DB = require('../config/config')

// Contains all the queries to the database concerning reserved spaces
module.exports = {

    // We retrieve the reserved spaces of an emplacement
    retrieveReservedSpaces : async (idEmplacement,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "EspaceReserve" WHERE "FK_idEmplacement" = $1;'
        const queryValues = [idEmplacement]
        return (await clientUsed.query(queryText, queryValues)).rows
    }
}