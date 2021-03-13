const DB = require('../config/config')

const Zone = require('./zoneModel')
const Emplacement = require('./emplacementModel')

// Update the festival that is the current one, and pass it at false
changeCurrentStateFestival = async (client) => {
    const queryText = 'UPDATE "Festival" SET "currentFestival" = false WHERE "currentFestival" = true;'
    client.query(queryText)
}

// Contains all the queries to the database concerning a festival
module.exports = {

    // Create a festival, and makes it the current one
    // nameFestival : String
    // emplacements : [{
    //     libelleEmplacement,
    //     coutTable,
    //     coutMetreCarre,
    //     nombreTablesPrevues
    //     }, ...] an array of all the emplacements to create
    createFestival: async (nameFestival,emplacements) => {
        const client = await DB.pool.connect()
        try {
            await client.query('BEGIN')
            // We need to pass the last current festival to false
            await changeCurrentStateFestival(client)
            // We create the new festival
            const queryText = 'INSERT INTO "Festival" ("nameFestival", "currentFestival") VALUES ($1, $2) RETURNING *;'
            const queryValues = [nameFestival, true]
            // We execute the query and stock the new festival created
            const newFestival = (await client.query(queryText, queryValues)).rows[0]
            // We need to create a first zone "undefined" in the festival
            await Zone.createNewZone("Zone - Indéfinie",newFestival.idFestival,client)
            // We need to create the emplacements
            let emp
            for(let i = 0; i<emplacements.length;i++){
                emp = emplacements[i]
                await Emplacement.createEmplacement(emp.libelleEmplacement,emp.coutTable,emp.coutMetreCarre,
                    emp.nombreTablesPrevues,newFestival.idFestival,client)
            }
            await client.query('COMMIT')
        } catch (err) {
            // Something wrong happened, we rollback
            await client.query('ROLLBACK')
        } finally {
            // We release the client in the pool
            client.release()
        }
    },

    // Pass the given festival to current Festival
    changeCurrentFestival : async (idFestival) => {
        const client = await DB.pool.connect()
        try {
            await client.query('BEGIN')
            // First we need to pass the older one to not current
            await changeCurrentStateFestival(client)
            // Now we update the given festival to current one
            const queryText = 'UPDATE "Festival" SET "currentFestival" = true WHERE "idFestival" = $1;'
            const queryValues = [idFestival]
            await client.query(queryText,queryValues)
            await client.query('COMMIT')
        } catch (err) {
            // Something wrong happened, we rollback
            await client.query('ROLLBACK')
        } finally {
            // We release the client in the pool
            client.release()
        }
    },

    // Update the name of a festival
    updateFestival : async (idFestival, nameFestival, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "Festival" SET "nameFestival" = $2 WHERE "idFestival" = $1;'
        const queryValues = [idFestival,nameFestival]
        clientUsed.query(queryText,queryValues)
    },

    // Retrieve the current festival
    retrieveCurrentFestival : async (client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "Festival" WHERE "currentFestival" = true;'
        return (await clientUsed.query(queryText)).rows[0]
    },

    // TODO Retrieve all the festivals, their emplacements and the reserved space
    retrieveFestivals : () => {

    }
}