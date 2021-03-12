const test = require('../models/festivalModel')

module.exports = {
    home: (req,res) => {
        //test.createFestival("Premier festival")
        res.json({ response : "Yes, it works, thanks." })
    }
}