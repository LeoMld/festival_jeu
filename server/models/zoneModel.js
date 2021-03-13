const DB = require('../config/config')

// Contains all the queries to the database concerning a zone
module.exports = {

    // Used to create a new zone in the DB
    createNewZone : async (libelleZone,FK_idFestival,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Zone" ("libelleZone","FK_idFestival") VALUES ($1,$2);'
        const queryValues = [libelleZone, FK_idFestival]
        clientUsed.query(text,queryValues)
    }
}