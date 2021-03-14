const DB = require('../config/config')

module.exports = {
    //Creating a contact linked to a Person
    createContact: async (prenomContact,nomContact,mailContact,telFixeContact,telPortableContact,fonctionContact,principal,FK_idPersonne,client)=>{
        try{
            const clientUsed = await DB.getPoolClient(client);
            const queryText = `INSERT INTO "Contact" 
("prenomContact","nomContact","mailContact","telFixeContact","telPortableContact","fonctionContact","principal","FK_idPersonne") 
VALUES ('${prenomContact}','${nomContact}','${mailContact}',${telFixeContact},${telPortableContact},'${fonctionContact}',${principal},${FK_idPersonne});`
            await clientUsed.query(queryText,[])
        }catch (e) {
            throw e
        }

    },
    //Updating a contact with all his info
    updateContact : async (idContact,prenomContact,nomContact,mailContact,telFixeContact,telPortableContact,fonctionContact,principal,client)=>{
        const clientUsed = await DB.getPoolClient(client);
        try{
            const queryText = `UPDATE "Contact" SET "prenomContact"='${prenomContact}',"nomContact"='${nomContact}',
                        "mailContact"='${mailContact}',"telFixeContact"=${telFixeContact},"telPortableContact"=${telPortableContact},
                        "fonctionContact"='${fonctionContact}',"principal"=${principal} 
                        WHERE "idContact" = ${idContact} ;`
            let result= await clientUsed.query(queryText,[])
            if (result.rowCount === 0){
                throw {error:"No contact with that id"}
            }
        }catch (e){
            throw e
        }
    },
    //Deleting a contact
    deleteContact: async (idContact,client)=>{
        try{
            const clientUsed = await DB.getPoolClient(client);
            const queryText = `DELETE FROM "Contact" WHERE "idContact" = ${idContact};`
            let result= await clientUsed.query(queryText,[])
            if (result.rowCount === 0){
                throw {error:"No contact with that id"}
            }
        }catch (e) {
            console.log(typeof e)
            throw e
        }

    },
    //Get the contacts of a person
    getContactsOf: async (idPersone,client)=>{
        try{
            const clientUsed = await DB.getPoolClient(client);
            const queryText = `SELECT * FROM "Contact" WHERE "FK_idPersonne" = ${idPersone};`

            let result = await (clientUsed.query(queryText,[]))
            return result.rows
        }catch (e){
            throw e
        }


    }

}