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

// We will use it to make our queries
module.exports = pool