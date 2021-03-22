const DB = require('../config/config')

// Contains all the queries to the database concerning a reservation
module.exports = {

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
    }
}
