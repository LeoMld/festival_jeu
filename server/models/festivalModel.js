const DB = require('../config/config')

const Zone = require('./zoneModel')
const Emplacement = require('./emplacementModel')

// Update the festival that is the current one, and pass it at false
changeCurrentStateFestival = async (client) => {
    const clientUsed = await DB.getPoolClient(client)
    const queryText = 'UPDATE "Festival" SET "currentFestival" = false WHERE "currentFestival" = true'
    clientUsed.query(queryText)
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
            const queryText = 'INSERT INTO "Festival" ("nameFestival", "currentFestival") VALUES ($1, $2) RETURNING *'
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
        } catch (e) {
            // Something wrong happened, we rollback
            await client.query('ROLLBACK')
        } finally {
            // We release the client in the pool
            client.release()
        }
    }
}