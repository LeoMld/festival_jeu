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
    },

    //Modify data of an emplacement
    modifyEmplacementFestival: async (libelleEmplacement, coutTable, coutMetreCarre, nombreTablesPrevues, idEmplacement, client) =>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "Emplacement" SET "FK_idFestival" = $1, "libelleEmplacement" = $2, "coutTable" = $3, "coutMetreCarre" = $4, "nombreTablesPrevues" = $5 WHERE "idEmplacement" = $6;'
        const queryValues = [idFestival, libelleEmplacement, coutTable, coutMetreCarre, nombreTablesPrevues, idEmplacement]
        clientUsed.query(queryText, queryValues)

    }
}