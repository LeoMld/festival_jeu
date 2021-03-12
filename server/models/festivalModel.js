const db = require('../config/config')

// Update the festival that is the current one, and pass it at false
changeCurrentStateFestival = async (client) => {
    const clientUsed = await db.getPoolClient(client)
    const text = 'UPDATE "Festival" SET "currentFestival" = false WHERE "currentFestival" = true'
    clientUsed.query(text)
}

// Contains all the queries to the database concerning a festival
module.exports = {

    // Create a festival, and makes it the current one
    // nameFestival : String
    createFestival: async (nameFestival) => {
        const client = await db.pool.connect()
        try {
            await client.query('BEGIN')
            // We need to pass the last current festival to false
            await changeCurrentStateFestival(client)
            // We create the new festival
            const queryText = 'INSERT INTO "Festival" ("nameFestival", "currentFestival") VALUES ($1, $2)'
            const queryValues = [nameFestival, true]
            await client.query(queryText, queryValues)
            // We need to create a first zone "undefined"
            // TODO
            // We need to create emplacements
            // TODO
            await client.query('COMMIT')
        } catch (e) {
            // Something wrong happened, we rollback
            await client.query('ROLLBACK')
        } finally {
            // We release the client in the pool
            client.release()
        }
    }
}