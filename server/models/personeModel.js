const DB = require('../config/config')

const Contact = require('./contactModel');

//Create an editor and his contact
module.exports={
    createPersonne :async (nomPersonne, adressePersonne, statutEditeur, estEditeur, exposantInactif, estExposant, prenomContact, nomContact, mailContact, telFixeContact, telPortableContact, fonctionContact, principal) =>{
        const client = await DB.pool.connect();
        try{
            await client.query('BEGIN;')
            const queryText = `INSERT INTO "Personne" 
            ("nomPersonne", "adressePersonne", "statutEditeur", "estEditeur", "exposantInactif", "estExposant")
            VALUES(${nomPersonne}, ${adressePersonne}, ${statutEditeur}, ${estEditeur}, ${exposantInactif}, ${estExposant}) RETURNING *;`
            const newPersonne = await client.query(queryText,[]);
            await Contact.createContact(prenomContact, nomContact, mailContact, telFixeContact, telPortableContact, fonctionContact, principal, newPersonne.idPersonne,client);
            await client.query('COMMIT;')
        }catch (e) {
            await client.query('ROLLBACK;')
        } finally {
            client.release()
        }
    },
    //update the info of a person
    editPersonne: async (idPersonne,nomPersonne, adressePersonne, statutEditeur, estEditeur, exposantInactif, estExposant,client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `UPDATE "Personne"  
        SET "nomPersonne"=${nomPersonne},"adressePersonne"=${adressePersonne},"statutEditeur"=${statutEditeur},"estEditeur"=${estEditeur},"exposantInactif"=${exposantInactif},"estExposant"=${estExposant} 
        WHERE "idPersonne"=${idPersonne};`
        clientUsed.query(queryText,[])
    },
    //edit a person to on "estExposant" attribute
    updatePersonneExposant: async (idPersonne,estExposant,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `UPDATE "Personne" SET "estExposant"=${estExposant} WHERE "idPersonne"=${idPersonne};`
        clientUsed.query(queryText,[])
    },
    //edit a person to on "estEditeur" attribute
    updatePersonneEditeur: async (idPersonne,estEditeur,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `UPDATE "Personne" SET "estEditeur"=${estEditeur} WHERE "idPersonne"=${idPersonne};`
        clientUsed.query(queryText,[])
    },
    //edit a person to on "exposantInactif" attribute
    updatePersonneInactif: async (idPersonne,exposantInactif,client) => {
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `UPDATE "Personne" SET "exposantInactif"=${exposantInactif} WHERE "idPersonne"=${idPersonne};`
        clientUsed.query(queryText,[])
    },
    //get all non inactif editor
    getEditeur: async (client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT * FROM "Personne" WHERE "estEditeur"=true AND "exposantInactif"=false;`
        return (await clientUsed.query(queryText,[]).rows)
    },
    //get all non inactif exposant
    getExposant: async (client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT * FROM "Personne" WHERE "estExposant"=true AND "exposantInactif"=false;`
        return (await clientUsed.query(queryText,[]).rows)
    }
}