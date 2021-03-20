const token = require("../utils/token");

const express = require('express');
const router = express.Router();

// We import the controller of the gestion routes
const gameController = require('../controllers/gameController');



router.get('/', gameController.getAllGames)

router.use( async (req,res,next)=>{
    try {

        if(await token.getStatus(req.headers.authorization) !== (1)){
            res.status(401).json({code: 0})
        }else{
            next();
        }
    }catch (e) {
        console.log(e)
    }

});

router.put('/:id', gameController.handleGame)

router.delete('/:id', gameController.deleteGame)

module.exports = router;
