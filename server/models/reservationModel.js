const DB = require('../config/config')
const EspaceReserve = require("./espaceReserveModel")
const jeuPresent = require("../models/jeuPresentModel")

/**
 * Description of the workflow. Each integer will describe a state :
 * 0 : Pas Contacté
 * 1 : Contacté (datePremierContact not null)
 * 2 : 2e Contact (dateSecondContact not null)
 * 3 : Pas de Réponse
 * 4 : 1. En discussion
 * 5 : 2. Présence Confirmée => Couleur Verte
 * 6 : 3. Présent liste jeux demandée ( to put in JeuPresent ) => Couleur Verte
 * 7 : 4. Présent : liste jeux reçue ( jeu in JeuPresent ) => Couleur Verte
 * 8 : Absent => Couleur Rouge
 * 9 : Considéré absent => Couleur Rouge
 **/
// Contains all the queries to the database concerning a reservation
module.exports = {
    createPersonReservation: async (idFestival, idPerson, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Reservation" ("FK_idPersonne","FK_idFestival") VALUES ($1,$2) RETURNING *;'
        const values = [idPerson, idFestival]
        return (await clientUsed.query(text, values)).rows[0]
    },

    //Get a festival reservations
    getFestivalReservations: async (idFestival, client) => {
        const clientUsed = await DB.getPoolClient(client)
        let text = 'SELECT * FROM "Reservation" JOIN "Personne" ON "Reservation"."FK_idPersonne"="Personne"."idPersonne" LEFT JOIN "Note" ON "Reservation"."idReservation"="Note"."FK_idReservation"  WHERE "Reservation"."FK_idFestival"=$1;'
        let values = [idFestival]
        let info = (await clientUsed.query(text, values)).rows
        for (let i = 0; i < info.length; i++) {
            let espace = await EspaceReserve.getReservationsSpaces(info[i].idReservation, clientUsed)
            info[i]["espace"] = espace
            let prixRenvoi = await jeuPresent.getFactureGames(info[i].idReservation, clientUsed)
            if (prixRenvoi.prixrenvoitotal) {
                info[i]["prixRenvoiTotal"] = parseInt(prixRenvoi.prixrenvoitotal)
            } else {
                info[i]["prixRenvoiTotal"] = 0
            }
        }
        return info

    },
    getAReservation: async (idReservation, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'SELECT * FROM "Reservation" JOIN "Personne" ON "Reservation"."FK_idPersonne"="Personne"."idPersonne" LEFT JOIN "Note" ON "Reservation"."idReservation"="Note"."FK_idReservation" WHERE "idReservation"=$1;'
        const values = [idReservation]
        let info = (await clientUsed.query(text, values)).rows[0]
        info["espace"] = await EspaceReserve.getReservationsSpaces(idReservation, clientUsed)
        info["jeuPresents"] = await jeuPresent.getReservationGames(idReservation, clientUsed)
        let prixRenvoi = await jeuPresent.getFactureGames(info.idReservation, clientUsed)
        if (prixRenvoi.prixrenvoitotal) {
            info["prixRenvoiTotal"] = parseInt(prixRenvoi.prixrenvoitotal)
        } else {
            info["prixRenvoiTotal"] = 0
        }
        return info


    },
    getReservation: async (idReservation, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'SELECT * FROM "Reservation" JOIN "Personne" ON "Reservation"."FK_idPersonne"="Personne"."idPersonne" LEFT JOIN "Note" ON "Reservation"."idReservation"="Note"."FK_idReservation" JOIN "EspaceReserve" ON "EspaceReserve"."FK_idReservation"="Reservation"."idReservation" WHERE "idReservation"=$1;'
        const values = [idReservation]
        return (await clientUsed.query(text, values)).rows[0]

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
    getPersonReservations: async (idPerson, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "Reservation" JOIN "Personne" ON "Reservation"."FK_idPersonne"="Personne"."idPersonne" LEFT JOIN "Note" ON "Reservation"."idReservation"="Note"."FK_idReservation"  WHERE "Reservation"."FK_idPersonne"=$1;'
        return (await clientUsed.query(queryText, [idPerson])).rows
    },

    //==========================UPDATE=============================
    updateSingleCol: async (idReservation, colName, colValue) => {
        const client = await DB.pool.connect()
        try {
            await client.query('BEGIN')
            let queryText
            if (colName.includes("date") && colValue === "") {
                queryText = `UPDATE "Reservation" SET "${colName}" = NULL WHERE "idReservation" = '${idReservation}';`
            } else {
                queryText = `UPDATE "Reservation" SET "${colName}" = '${colValue}' WHERE "idReservation" = '${idReservation}';`
            }
            const rowCount = await client.query(queryText, [])
            switch (colName) {
                case "datePaiementFactureReservation":
                    // The reservation is now paid
                    queryText = `UPDATE "Reservation" SET "payeReservation" = '${colValue !== ""}' WHERE "idReservation" = $1;`
                    await client.query(queryText, [idReservation])
                    break;
                case "datePremierContactReservation":
                    if (colValue !== "") {
                        queryText = `UPDATE "Reservation"
                                     SET "workflowReservation" = 1
                                     WHERE "idReservation" = $1;`
                        await client.query(queryText, [idReservation])
                    }
                    break;
                case "dateSecondContactReservation":
                    if (colValue !== "") {
                        queryText = `UPDATE "Reservation"
                                     SET "workflowReservation" = 2
                                     WHERE "idReservation" = $1;`
                        await client.query(queryText, [idReservation])
                    }
                    break;
            }
            await client.query('COMMIT')
            return rowCount
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
}
