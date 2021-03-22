const DB = require('../config/config')
module.exports={

    // We create a new game
    createJeu : async (libellejeu,nombreJoueur,ageMinimum, duree,prototype, FK_idTypeJeu, FK_idPersonne, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Jeu" ("libelleJeu","nombreJoueur","ageMinimum","duree","prototype", "FK_idTypeJeu", "FK_idPersonne") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING "idJeu";'
        const queryValues = [ libellejeu,nombreJoueur,ageMinimum, duree,prototype, FK_idTypeJeu, FK_idPersonne]

        return (await clientUsed.query(text,queryValues)).rows[0].idJeu
    },

    //delete a game
    deleteJeu : async (idJeu, client) =>{
        const clientUsed = await DB.getPoolClient(client)
        const text = 'DELETE FROM "Jeu" WHERE "idJeu" = $1'
        const queryValues = [idJeu]
        clientUsed.query(text,queryValues)
    },

    //delete a type
    deleteType : async (idJeu, client) =>{
        const clientUsed = await DB.getPoolClient(client)
        const text = 'DELETE FROM "TypeJeu" WHERE "idTypeJeu" = $1'
        const queryValues = [idJeu]
        clientUsed.query(text,queryValues)
    },

    //modify the prototype value of a game (boolean)
    modifyPrototypeJeu : async (idJeu, isPrototype, client) =>{

        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "Jeu" SET "prototype" = $1 WHERE "idJeu" = $2;'
        const queryValues = [isPrototype, idJeu]
        clientUsed.query(queryText, queryValues)
    },

    //modify a game
    modifyJeu : async (libellejeu,nombreJoueur,ageMinimum, duree,prototype, FK_idTypeJeu, FK_idPersonne, idJeu, client) =>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "Jeu" SET "libelleJeu" = $1, "nombreJoueur" = $2, "ageMinimum" = $3, "duree" = $4, "prototype" = $5, "FK_idPersonne"=$6, "FK_idTypeJeu"=$7 WHERE "idJeu" = $8;'
        const queryValues = [libellejeu,nombreJoueur,ageMinimum, duree,prototype, FK_idTypeJeu, FK_idPersonne, idJeu]
        clientUsed.query(queryText, queryValues)
    },

    //create a type of game
    createTypeGame : async (libelleTypeJeu,client) =>{
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "TypeJeu" ("libelleTypeJeu") VALUES ($1);'
        const queryValues = [libelleTypeJeu]
        clientUsed.query(text, queryValues)
    },

    //modify a type of game
    modifyTypeJeu : async (idTypeJeu, libelleTypeJeu, client) =>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "TypeJeu" SET "libelleTypeJeu" = $2 WHERE "idTypeJeu" = $1;'
        const queryValues = [idTypeJeu, libelleTypeJeu]
        clientUsed.query(queryText, queryValues)
    },

    // Retrieve all games
    getAllGames: async (client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "Jeu" ;'
        return (await clientUsed.query(queryText)).rows
    },
    //retrieve all games from an editor
    getEditorGames: async (idEditor,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT j."idJeu", "libelleJeu", "nombreJoueur", "ageMinimum", duree, prototype, "FK_idPersonne",t."libelleTypeJeu" FROM "Jeu" j JOIN "TypeJeu" t ON t."idTypeJeu" = j."FK_idTypeJeu" 
        WHERE j."FK_idPersonne"=${idEditor} ;`
        return (await clientUsed.query(queryText)).rows
    },

    // Retrieve a game
    getGame: async (idJeu,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "Jeu" WHERE "idJeu"=$1;'
        const queryValues = [idJeu]
        return (await clientUsed.query(queryText,queryValues)).rows
    },

    // Retrieve all types
    getTypesJeux: async (idJeu,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'SELECT * FROM "TypeJeu";'
        return (await clientUsed.query(queryText)).rows
    },



}
