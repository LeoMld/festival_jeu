const DB = require('../config/config')

const Zone = require('./zoneModel')
const Emplacement = require('./emplacementModel')
const EspaceReserve = require('./espaceReserveModel')

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
    createFestival: async (nameFestival, emplacements) => {
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
            await Zone.createNewZone("Zone - Indéfinie", newFestival.idFestival, client)
            // We need to create the emplacements
            let emp
            newFestival.emplacements = [emplacements.length]
            for (let i = 0; i < emplacements.length; i++) {
                emp = emplacements[i]
                newFestival.emplacements[i] = (await Emplacement.createEmplacement(emp.libelleEmplacement, parseFloat(emp.coutTable),
                    parseFloat(emp.coutMetreCarre), parseInt(emp.nombreTablesPrevues), newFestival.idFestival, client)).rows[0]
            }
            await client.query('COMMIT')
            return newFestival
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

    // Pass the given festival to current Festival
    changeCurrentFestival: async (idFestival) => {
        const client = await DB.pool.connect()
        try {
            await client.query('BEGIN')
            // First we need to pass the older one to not current
            await changeCurrentStateFestival(client)
            // Now we update the given festival to current one
            const queryText = 'UPDATE "Festival" SET "currentFestival" = true WHERE "idFestival" = $1;'
            const queryValues = [idFestival]
            await client.query(queryText, queryValues)
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

    // Update the name of a festival
    updateFestival: async (idFestival, nameFestival, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "Festival" SET "nameFestival" = $2 WHERE "idFestival" = $1;'
        const queryValues = [idFestival, nameFestival]
        clientUsed.query(queryText, queryValues)
    },

    // Retrieve the current festival
    retrieveCurrentFestival: async (client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "Festival" WHERE "currentFestival" = true;'
        return (await clientUsed.query(queryText)).rows[0]
    },

    // Retrieve all the festivals, their emplacements and the reserved space
    retrieveFestivals: async () => {
        const client = await DB.pool.connect()
        let festivals = []
        try {
            // First, we retrieve all the festivals
            let queryText = 'SELECT * FROM "Festival" ORDER BY "currentFestival" DESC, "dateCreation" DESC, "idFestival" DESC;'
            festivals = (await client.query(queryText)).rows;
            // Then all the emplacements of each festival
            let emplacements
            for (let i = 0; i < festivals.length; i++) {
                // We retrieve the emplacements of the festival
                emplacements = (await Emplacement.retrieveEmplacements(festivals[i].idFestival))
                festivals[i].emplacements = emplacements
                // Now we retrieve the reserved spaces from each emplacements
                let reservedSpaces
                let numberTables
                let numberSquareMeters
                for (let j = 0; j < emplacements.length; j++) {
                    reservedSpaces = (await EspaceReserve.retrieveReservedSpaces(emplacements[j].idEmplacement, client))
                    // Now we calculate how much tables and square meters reserved we have for each emplacement
                    numberTables = 0
                    numberSquareMeters = 0
                    for (let z = 0; z < reservedSpaces.length; z++) {
                        numberTables += reservedSpaces[z].nombreTables
                        numberSquareMeters += reservedSpaces[z].metreCarres
                    }
                    festivals[i].emplacements[j].numberTables = numberTables
                    festivals[i].emplacements[j].numberSquareMeters = numberSquareMeters
                    festivals[i].emplacements[j].availableTables = emplacements[j].nombreTablesPrevues -
                        (numberTables + (numberSquareMeters / 6))
                }
            }
        } catch (err) {
            // The controller will handle this
            throw err
        } finally {
            // We release the client in the pool
            client.release()
        }
        return festivals
    }
}