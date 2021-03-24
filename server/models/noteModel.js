const DB = require('../config/config')

module.exports = {
    createNote : async (idReservation,note,client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'INSERT INTO "Note" ("textNote","FK_idReservation") VALUES ($1,$2) RETURNING *'
        const values = [note,idReservation]
        return (await clientUsed.query(queryText,values)).rows[0]
    },
    updateNote : async (idNote,note,client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = 'UPDATE "Note" SET "textNote"=$1 WHERE "idNote"=$2'
        const values = [note,idNote]
        return (await clientUsed.query(queryText,values))
    }

}
