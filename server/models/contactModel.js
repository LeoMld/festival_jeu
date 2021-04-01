const DB = require('../config/config')

module.exports = {
    //Creating a contact linked to a Person
    createContact: async (prenomContact,nomContact,mailContact,telFixeContact,telPortableContact,fonctionContact,principal,FK_idPersonne,client)=>{
        try{
            const clientUsed = await DB.getPoolClient(client);
            if(principal){
                let queryText = 'UPDATE "Contact" SET "principal"=false WHERE "FK_idPersonne"=$1;'
                await clientUsed.query(queryText,[FK_idPersonne])
            }
            let queryText = `INSERT INTO "Contact" 
("prenomContact","nomContact","mailContact","telFixeContact","telPortableContact","fonctionContact","principal","FK_idPersonne") 
VALUES ('${prenomContact}','${nomContact}','${mailContact}',${telFixeContact===undefined?NULL:telFixeContact},${telPortableContact},'${fonctionContact}',${principal},${FK_idPersonne});`
            console.log(queryText)
            await clientUsed.query(queryText,[])
            queryText = 'SELECT * FROM "Contact" WHERE "FK_idPersonne"=$1;'
            return (await clientUsed.query(queryText,[FK_idPersonne])).rows

        }catch (e) {
            throw e
        }

    },
    //Updating a contact with all his info
    updateContact : async (idContact,prenomContact,nomContact,mailContact,telFixeContact,telPortableContact,fonctionContact,principal,idPersonne)=>{
        const clientUsed = await DB.pool.connect();

        try{
            await clientUsed.query('BEGIN')
            if(principal){
                let queryText = 'UPDATE "Contact" SET "principal"=false WHERE "FK_idPersonne"=$1;'
                await clientUsed.query(queryText,[idPersonne])
            }
            let queryText = `UPDATE "Contact" SET "prenomContact"='${prenomContact}',"nomContact"='${nomContact}',
                        "mailContact"='${mailContact}',"telFixeContact"='${telFixeContact}',"telPortableContact"='${telPortableContact}',
                        "fonctionContact"='${fonctionContact}',"principal"=${principal} 
                        WHERE "idContact" = ${idContact} ;`
            console.log(queryText)
            let result= await clientUsed.query(queryText,[])
            if (result.rowCount === 0){
                throw {error:"No contact with that id"}
            }
            await clientUsed.query('COMMIT')
        }catch (e){
            await clientUsed.query('ROLLBACK')
            throw e
        }finally {
            clientUsed.release()

        }
    },
    updatePrincipal: async (idPerson,idContact,principal)=>{
        const clientUsed = await DB.pool.connect();
        try{
            if(principal){
                await clientUsed.query('BEGIN')
                let queryText = 'UPDATE "Contact" SET "principal"=false WHERE "FK_idPersonne"=$1;'
                let res = await clientUsed.query(queryText,[idPerson])
                queryText = 'UPDATE "Contact" SET "principal"=true WHERE "idContact"=$1;'
                res = await clientUsed.query(queryText,[idContact])
                await clientUsed.query('COMMIT')
            }else{
                let queryText = 'UPDATE "Contact" SET "principal"=false WHERE "idContact"=$1;'
                let res = await clientUsed.query(queryText,[idContact])
            }
        }catch (e){
            await clientUsed.query('ROLLBACK')
            throw e
        }finally {
            clientUsed.release()
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
