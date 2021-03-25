const Note = require("../models/noteModel")

module.exports = {
    createNote : async (req,res)=>{
        let body = req.body
        await Note.createNote(body.idReservation,body.textNote)
            .then((result)=>{
                res.status(201).json(result)
            })
            .catch((e)=>{
                res.status(400).json(e)
            })
    },
    updateNote : async(req,res)=>{
        let idNote = req.params.id
        let body = req.body
        console.log(idNote + " " +body.textNote)
        await Note.updateNote(idNote,body.textNote)
            .then((result)=>{
                res.status(201).json(result)
            })
            .catch((e)=>{
                res.status(400).json(e)
            })
    }

}
