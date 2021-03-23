const DB = require('../config/config')

/**
 * Description of the workflow. Each integer will describe a state :
 * 0 : Pas Contacté
 * 1 : Contacté (datePremierContact not null)
 * 2 : 2e Contact (dateSecondContact not null)
 * 3 : Pas de Réponse
 * 4 : 1. En discussion
 * 5 : 2. Présence Confirmée
 * 6 : 3. Présent liste jeux demandée ( to put in JeuPresent )
 * 7 : 4. Présent : liste jeux reçue ( jeu in JeuPresent )
 * 8 : Absent
 * 9 : Considéré absent
**/
// Contains all the queries to the database concerning a reservation
module.exports = {
    createPersonReservation : async (idFestival,idPerson,client) =>{
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Reservation" ("FK_idPersonne","FK_idFestival") VALUES ($1,$2);'
        const values = [idPerson,idFestival]
        clientUsed.query(text,values)
    },

    //Get a festival reservations
    getFestivalReservations : async (idFestival,client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const text = 'SELECT * FROM "Reservation" JOIN "Personne" ON "Reservation"."FK_idPersonne"="Personne"."idPersonne" LEFT JOIN "Note" ON "Reservation"."idReservation"="Note"."FK_idReservation" JOIN "EspaceReserve" ON "EspaceReserve"."FK_idReservation"="Reservation"."idReservation" WHERE "FK_idFestival"=$1;'
        const values = [idFestival]
        return (await clientUsed.query(text,values)).rows

    },
    getAReservations : async (idReservation,client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const text = 'SELECT * FROM "Reservation" JOIN "Personne" ON "Reservation"."FK_idPersonne"="Personne"."idPersonne" LEFT JOIN "Note" ON "Reservation"."idReservation"="Note"."FK_idReservation" JOIN "EspaceReserve" ON "EspaceReserve"."FK_idReservation"="Reservation"."idReservation" WHERE "idReservation"=$1;'
        const values = [idReservation]
        return (await clientUsed.query(text,values)).rows[0]

    },


    // Retrieve the amount paid for a given festival
    retrievePaidReservations: async (idFestival, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT "prixReservation" FROM "Reservation" WHERE "FK_idFestival" = $1 AND "payeReservation" = true;'
        const queryValues = [idFestival]
        // We retrieve how much has been paid for the festival
        const prices = (await clientUsed.query(queryText, queryValues)).rows
        let totalAmount = 0
        for (let i = 0; i < prices.length; i++) {
            totalAmount += prices[i].prixReservation
        }
        return totalAmount.toFixed(2);
    },
    //get Reservation from person
    getPersonReservations : async (idPerson,client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText =`SELECT * FROM "Reservation" WHERE "FK_idPersonne"=${idPerson};`
        return (await clientUsed.query(queryText, [])).rows
    },

    //==========================UPDATE=============================
    updateSingleCol : async (idReservation,colName,colValue,client) =>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `UPDATE "Reservation" SET "${colName}" = '${colValue}' WHERE "idReservation" = '${idReservation}';`
        return await clientUsed.query(queryText, [])
    },
}
