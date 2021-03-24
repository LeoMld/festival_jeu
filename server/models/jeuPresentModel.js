const DB = require('../config/config')

// Contains all the queries to the database concerning games in reservations
module.exports = {

    setZoneToDefault: async (idZoneDefault, idZone, client) => {
        const clientUsed = DB.getPoolClient(client)
        const queryText = 'UPDATE "JeuPresent" SET "PK_idZone" = $2, "estPlace" = false WHERE "PK_idZone" = $1;'
        const queryValues = [idZone, idZoneDefault]
        clientUsed.query(queryText, queryValues)
    },
    getReservationGames : async (idReservation,client) =>{
        const clientUsed = DB.getPoolClient(client)
        const queryText= 'SELECT * FROM "JeuPresent" JOIN "JEU" ON "JEU"."idJeu"="JeuPresent"."PK_idJeu" JOIN "TypeJeu" ON "TypeJeu"."idTypeJeu"="Jeu"."FK_idTypeJeu" WHERE "JeuPresent"."PK_idReservation"=$1'
        const queryValues = [idReservation]
        return (await clientUsed.query(queryText, queryValues)).rows
    },
    //retrieve games with prixRenvoi != 0 for a reservation
    getFactureGames : async (idReservation,client)=>{
        const clientUsed = DB.getPoolClient(client)
        const queryText= 'SELECT SUM("prixRenvoi") as prixRenvoiTotal FROM "JeuPresent" WHERE "PK_idReservation"=$1'
        const queryValues = [idReservation]
        return (await clientUsed.query(queryText, queryValues)).rows[0]


    }

}
