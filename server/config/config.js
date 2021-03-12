// Contains the connection to the database
const {Pool} = require('pg')

// We create the pool of connections
const pool = new Pool({
    user: process.env.PGUSER,
    host:  process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})

module.exports = {

    pool : pool,

    // Retrieve the pool or a client that we will use to query
    // client : pool or client, .query
    getPoolClient : (client) => {
        let clientUsed;
        if(client === undefined){
            // No client used, we send the pool for a single query
            clientUsed = pool
        }
        else{
            // Already a client being used, we still use it
            clientUsed = client
        }
        return clientUsed
    }
}