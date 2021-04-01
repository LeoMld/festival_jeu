const DB = require('../config/config')

module.exports = {

    // We create a new game
    createJeu: async (libellejeu, nombreJoueur, ageMinimum, duree, prototype, FK_idTypeJeu, FK_idPersonne, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Jeu" ("libelleJeu","nombreJoueur","ageMinimum","duree","prototype", "FK_idTypeJeu", "FK_idPersonne") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING "idJeu";'
        const queryValues = [libellejeu, nombreJoueur, ageMinimum, duree, prototype, FK_idTypeJeu, FK_idPersonne]

        return (await clientUsed.query(text, queryValues)).rows[0].idJeu
    },

    //delete a game
    deleteJeu: async (idJeu, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'DELETE FROM "Jeu" WHERE "idJeu" = $1'
        const queryValues = [idJeu]
        await clientUsed.query(text, queryValues)
    },

    //delete a type
    deleteType: async (idJeu, client) => {

        const clientUsed = await DB.getPoolClient(client)
        const text = 'DELETE FROM "TypeJeu" WHERE "idTypeJeu" = $1'
        const queryValues = [idJeu]
        await clientUsed.query(text, queryValues)


    },

    //modify the prototype value of a game (boolean)
    modifyPrototypeJeu: async (idJeu, isPrototype, client) => {

        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "Jeu" SET "prototype" = $1 WHERE "idJeu" = $2;'
        const queryValues = [isPrototype, idJeu]
        await clientUsed.query(queryText, queryValues)
    },

    //modify a game
    modifyJeu: async (libellejeu, nombreJoueur, ageMinimum, duree, prototype, FK_idTypeJeu, FK_idPersonne, idJeu, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "Jeu" SET "libelleJeu" = $1, "nombreJoueur" = $2, "ageMinimum" = $3, "duree" = $4, "prototype" = $5, "FK_idPersonne"=$6, "FK_idTypeJeu"=$7 WHERE "idJeu" = $8;'
        const queryValues = [libellejeu, nombreJoueur, ageMinimum, duree, prototype, FK_idTypeJeu, FK_idPersonne, idJeu]
        await clientUsed.query(queryText, queryValues)
    },

    //create a type of game
    createTypeGame: async (libelleTypeJeu, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "TypeJeu" ("libelleTypeJeu") VALUES ($1);'
        const queryValues = [libelleTypeJeu]
        await clientUsed.query(text, queryValues)
    },

    //modify a type of game
    modifyTypeJeu: async (idTypeJeu, libelleTypeJeu, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "TypeJeu" SET "libelleTypeJeu" = $2 WHERE "idTypeJeu" = $1;'
        const queryValues = [idTypeJeu, libelleTypeJeu]
        await clientUsed.query(queryText, queryValues)
    },

    // Retrieve all games
    getAllGames: async (client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "Jeu" JOIN "Personne" ON "FK_idPersonne"="Personne"."idPersonne" JOIN "TypeJeu" TJ on TJ."idTypeJeu" = "Jeu"."FK_idTypeJeu" ORDER BY "libelleJeu"  ;'
        return (await clientUsed.query(queryText)).rows
    },

    // Retrieve all games of the current festival
    getAllGamesCurrentFestival: async (idFest,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT DISTINCT "idJeu", "libelleZone", "libelleJeu", "nombreJoueur", "ageMinimum", "duree", "libelleTypeJeu", "prototype", "nomPersonne","idTypeJeu" FROM "JeuPresent"\n' +
            '    JOIN "Jeu" ON "JeuPresent"."PK_idJeu" = "Jeu"."idJeu" ' +
            '    JOIN "Personne" ON "FK_idPersonne"="Personne"."idPersonne" ' +
            '    JOIN "TypeJeu" TJ on TJ."idTypeJeu" = "Jeu"."FK_idTypeJeu" ' +
            '    LEFT JOIN "Reservation" R on "Personne"."idPersonne" = R."FK_idPersonne" ' +
            '    LEFT JOIN "Zone" Z ON "JeuPresent"."PK_idZone" = Z."idZone" ' +
            'WHERE Z."FK_idFestival"=$1 AND Z."libelleZone" != $2 ORDER BY "libelleJeu"'
        const queryValues = [idFest,"Indéfinie"]
        return (await clientUsed.query(queryText,queryValues)).rows
    },
    //retrieve all games from an editor
    getEditorGames: async (idEditor, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT * FROM "Jeu" j JOIN "TypeJeu" t ON t."idTypeJeu" = j."FK_idTypeJeu" 
        WHERE j."FK_idPersonne"=${idEditor} ;`
        return (await clientUsed.query(queryText)).rows
    },

    // Retrieve a game
    getGame: async (idJeu, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "Jeu" WHERE "idJeu"=$1;'
        const queryValues = [idJeu]
        return (await clientUsed.query(queryText, queryValues)).rows
    },

    // Retrieve all types
    getTypesJeux: async (client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "TypeJeu";'
        return (await clientUsed.query(queryText)).rows
    },

    // Retrieve the type of a game
    getTypeJeu: async (idTypeJeu, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "TypeJeu" WHERE "idTypeJeu" = $1;'
        const queryValues = [idTypeJeu]
        return (await clientUsed.query(queryText, queryValues)).rows[0]
    }
}
