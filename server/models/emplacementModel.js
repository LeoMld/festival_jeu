const DB = require('../config/config')

// Contains all the queries to the database concerning an emplacement
module.exports = {

    // We create a new emplacement for a festival in the DB
    createEmplacement : async (libelleEmplacement,coutTable,coutMetreCarre,
                               nombreTablesPrevues,FK_idFestival,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Emplacement" ("libelleEmplacement","coutTable","coutMetreCarre",' +
            '"nombreTablesPrevues","FK_idFestival") VALUES ($1,$2,$3,$4,$5);'
        const queryValues = [libelleEmplacement, coutTable, coutMetreCarre, nombreTablesPrevues, FK_idFestival]
        clientUsed.query(text,queryValues)
    }
}