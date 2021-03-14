const DB = require('../config/config')

// Contains all the queries to the database concerning a zone
module.exports = {

    // Used to create a new zone in the DB
    createNewZone : async (libelleZone,FK_idFestival,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const text = 'INSERT INTO "Zone" ("libelleZone","FK_idFestival") VALUES ($1,$2);'
        const queryValues = [libelleZone, FK_idFestival]
        clientUsed.query(text,queryValues)
    },
    //Update a zone
    updateZone: async (idZone,libelleZone,client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `UPDATE "Zone" SET "libelleZone"=${libelleZone} WHERE "idZone"=${idZone};`
        clientUsed.query(queryText,[])
    },
    //Delete a zone from a festival
    deleteZone: async (idZone,client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `DELETE FROM "Zone" WHERE "idZone"=${idZone};`
        clientUsed.query(queryText,[])
    },
    //Get all zones form a festival
    getAFestivalZones: async (FK_idFestival,client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT * FROM "Zone" WHERE "FK_idFestival"=${FK_idFestival};`
        return (await clientUsed.query(queryText,[]).rows)
    },
}