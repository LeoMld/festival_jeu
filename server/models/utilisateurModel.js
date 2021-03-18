const DB = require('../config/config')

const Contact = require('./contactModel');


module.exports={

    //Get an user
    searchUser : async (mail, client)=>{
        const clientUsed = await DB.getPoolClient(client)
        const queryText = `SELECT * FROM "Utilisateur" WHERE "mailUtilisateur"=$1;`
        let result = await clientUsed.query(queryText,[mail])
        return result.rows
    }

}
