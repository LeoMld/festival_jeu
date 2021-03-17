const DB = require('../config/config')

const Contact = require('./contactModel');

//Create an editor and his contact
module.exports={

    // We create a new game
    createJeu : async (libellejeu,nombreJoueur,ageMinimum, duree,prototype, FK_idTypeJeu, FK_idPersonne, client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Jeu" ("libelleJeu","nombreJoueur","ageMinimum",' +
            '"duree","prototype", "FK_idTypeJeu", "FK_idPersonne") VALUES ($1,$2,$3,$4,$5,$6,$7);'
        const queryValues = [ libellejeu,nombreJoueur,ageMinimum, duree,prototype, FK_idTypeJeu, FK_idPersonne]
        clientUsed.query(text,queryValues)
    },

    //delete a game
    deleteJeu : async (idJeu, client) =>{
        const clientUsed = await DB.getPoolClient(client)
        const text = 'DELETE FROM "Jeu" WHERE "idJeu" = $1'
        const queryValues = [idJeu]
        clientUsed.query(text,queryValues)
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

}