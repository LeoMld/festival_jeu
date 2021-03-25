const DB = require('../config/config')

// Create a new reserved space for the emplacement and the reservation given
createEspaceReserve = async (idEmplacement, idReservation, nombreTables, metresCarres, client) => {
    const clientUsed = await DB.getPoolClient(client)
    const queryText = 'INSERT INTO "EspaceReserve" ("FK_idEmplacement","FK_idReservation","nombreTables","metreCarres") ' +
        'VALUES($1,$2,$3,$4) RETURNING *;'
    const queryValues = [idEmplacement, idReservation, nombreTables, metresCarres]
    return (await clientUsed.query(queryText, queryValues)).rows[0]
}

// Update a reserved space
updateEspaceReserve = async (idEspace, nombreTables, metresCarres, client) => {
    const clientUsed = await DB.getPoolClient(client)
    const queryText = 'UPDATE "EspaceReserve" SET "nombreTables" = $1, "metreCarres" = $2 WHERE "idEspace" = $3;'
    const queryValues = [nombreTables, metresCarres, idEspace]
    await clientUsed.query(queryText, queryValues)
}

// Contains all the queries to the database concerning reserved spaces
module.exports = {

    // We retrieve the reserved spaces of an emplacement
    retrieveReservedSpaces: async (idEmplacement, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "EspaceReserve" WHERE "FK_idEmplacement" = $1;'
        const queryValues = [idEmplacement]
        return (await clientUsed.query(queryText, queryValues)).rows
    },
    getReservationsSpaces: async (idReservation, client) => {
        const clientUsed = await DB.getPoolClient(client)
        let text = 'SELECT * FROM  "EspaceReserve" JOIN "Emplacement" E on E."idEmplacement" = "EspaceReserve"."FK_idEmplacement" WHERE "EspaceReserve"."FK_idReservation"=$1;'
        let values = [idReservation]
        return (await clientUsed.query(text, values)).rows
    },

    createSeveralEspacesReserves: async (espacesReserves, idReservation) => {
        const client = await DB.pool.connect()
        try {
            await client.query('BEGIN')
            const newEspacesReserves = []
            // We create all the spaces
            for (let i = 0; i < espacesReserves.length; i++) {
                const idEmplacement = espacesReserves[i].idEmplacement
                const nombreTables = parseFloat(espacesReserves[i]["nombreTables" + i])
                const metreCarres = parseFloat(espacesReserves[i]["metreCarres" + i])
                newEspacesReserves.push(await createEspaceReserve(idEmplacement, idReservation, nombreTables, metreCarres, client))
            }
            await client.query('COMMIT')
            return newEspacesReserves
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

    // We update all the reserved spaces given
    updateSeveralReservedSpaces: async (espacesReserves) => {
        const client = await DB.pool.connect()
        try {
            await client.query('BEGIN')
            for (let i = 0; i < espacesReserves.length; i++) {
                const idEspace = espacesReserves[i].idEspace
                const nombreTables = parseFloat(espacesReserves[i].nombreTables)
                const metreCarres = parseFloat(espacesReserves[i].metreCarres)
                await updateEspaceReserve(idEspace, nombreTables, metreCarres, client)
            }
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
    }
}
