const DB = require('../config/config')

module.exports = {
    //Creating a contact linked to a Person
    createContact: async (prenomContact,nomContact,mailContact,telFixeContact,telPortableContact,fonctionContact,principal,idPersonne,client)=>{
        const clientUsed = await DB.getPoolClient(client);
        const queryText = `INSERT INTO "Contact"
        ("prenomContact","nomContact","mailContact","telFixeContact","telPortableContact","fonctionContact","principal","idPersonne")
        VALUES(${prenomContact},${nomContact},${mailContact},${telFixeContact},${telPortableContact},${fonctionContact},${principal},${idPersonne});`
        clientUsed.query(queryText,[])
    },
    //Updating a contact with all his info
    updateContact : async (idContact,prenomContact,nomContact,mailContact,telFixeContact,telPortableContact,fonctionContact,principal,client)=>{
        const clientUsed = await DB.getPoolClient(client);
        const queryText = `UPDATE "Contact" SET "prenomContact"=${prenomContact},"nomContact"=${nomContact},
                        "mailContact"=${mailContact},"telFixeContact"=${telFixeContact},"telPortableContact"=${telPortableContact},
                        "fonctionContact"=${fonctionContact},"principal"=${principal} 
                        WHERE idContact = idContact ;`
        clientUsed.query(queryText,[])
    },
    //Deleting a contact
    deleteContact: async (idContact,client)=>{
        const clientUsed = await DB.getPoolClient(client);
        const queryText = `DELETE FROM "Contact" WHERE idContact = ${idContact};`
        clientUsed.query(queryText,[])
    },
    //Get the contacts of a person
    getContactsOf: async (idPersone,client)=>{
        const clientUsed = await DB.getPoolClient(client);
        const queryText = `SELECT * FROM "Contact" WHERE idPersonne = ${idPersone};`
        return (await clientUsed.query(queryText,[]).rows)

    }

}