const DB = require('../config/config')

const JeuPresent = require('./jeuPresentModel')

// Retrieve the default zone of a festival
getFestivalDefaultZone = async (FK_idFestival, client) => {
    const clientUsed = await DB.getPoolClient(client)
    const queryText = 'SELECT * FROM "Zone" WHERE "FK_idFestival" = $1 AND "libelleZone" = $2 ;'
    const queryValues = [FK_idFestival, "Indéfinie"]
    return (await clientUsed.query(queryText, queryValues)).rows[0];
}

// Contains all the queries to the database concerning a zone
module.exports = {

    // Used to create a new zone in the DB
    createNewZone: async (libelleZone, FK_idFestival, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Zone" ("libelleZone","FK_idFestival") VALUES ($1,$2) RETURNING *;'
        const queryValues = [libelleZone, FK_idFestival]
        return (await clientUsed.query(text, queryValues)).rows[0]
    },
    //Update a zone
    updateZone: async (idZone, libelleZone, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `UPDATE "Zone" SET "libelleZone"='${libelleZone}' WHERE "idZone"=${idZone};`
        clientUsed.query(queryText, [])
    },
    //Delete a zone from a festival
    deleteZone: async (idZone, FK_idFestival) => {
        const client = await DB.pool.connect()
        try {
            await client.query('BEGIN')
            // Before deleting, we need to pass all the games to the default zone
            const defaultZone = await getFestivalDefaultZone(FK_idFestival, client)
            await JeuPresent.setZoneToDefault(defaultZone.idZone, idZone, client)
            // Now, we delete
            const queryText = `DELETE FROM "Zone" WHERE "idZone"=${idZone};`
            client.query(queryText, [])
            await client.query('COMMIT')
        } catch (err) {
            // Something wrong happened, we rollback
            await client.query('ROLLBACK')
            // The controller will handle this
            throw err
        } finally {
            // We release the client in the pool
            client.release()
        }
    },

    //Get all zones form a festival
    getAFestivalZones: async (FK_idFestival, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "Zone" WHERE "FK_idFestival" = $1 ORDER BY "dateCreationZone" DESC, "idZone";'
        const queryValues = [FK_idFestival]
        return (await clientUsed.query(queryText, queryValues)).rows;
    }
}
