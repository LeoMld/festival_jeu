const Contact = require("../models/contactModel")

module.exports = {

    getEditorPage : async (req,res)=>{
        let idEditor = req.params.id;
        if(isNaN(idEditor)){
            utils.sendErrorNumber(req,res,Object.keys({idEditor})[0])
        }else{
            await Contact.getContactsOf(idEditor)
                .then((result)=>{
                    if(result.length===0){
                        res.status(200).json('No Contacts')
                    }else{
                        res.status(200).json({data:result})
                    }
                })
                .catch((error)=>{
                    res.status(503).json({error: error})
                })
        }
    },

}
