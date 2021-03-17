const Contact = require('../models/contactModel')
const utils = require("../utils/utils");

module.exports ={
    //retrieve all contact from a person
    /*getAllContact: async (req,res)=>{
        console.log(req.params)
        let idPersone=parseInt(req.params.idPersone);
        if(isNaN(idPersone)){
            utils.sendErrorNumber(req,res,Object.keys({idPersone})[0])
        }else{
            //let idPersone=1;
            await Contact.getContactsOf(idPersone)
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
    },*/
    //Create a contact linked to a person
    createContact: async (req,res)=>{
        /*let params = {
            prenomContact:'testContact',
            nomContact:'testContact',
            mailContact:'testContact',
            telFixeContact:111,
            telPortableContact:111,
            fonctionContact:'testContact',
            principal:true,
            idPersonne:1
        }*/
        const body = req.body;
        let telFixeContact = body.telFixeContact;
        let telPortableContact = body.telPortableContact;
        if(isNaN(telFixeContact)){
            utils.sendErrorNumber(req,res,Object.keys({telFixeContact})[0])
        }
        else if(isNaN(telPortableContact)){
            utils.sendErrorNumber(req,res,Object.keys({telPortableContact})[0])
        }
        else{
            await Contact.createContact(body.prenomContact,body.nomContact,body.mailContact,body.telFixeContact,body.telPortableContact,body.fonctionContact,body.principal,body.idPersonne)
                .then(()=>{
                    res.status(201).json({inserted:true})
                }).catch((error)=>{
                    res.status(503).json({
                        error:error,
                        inserted:false
                    })
                })
        }
    },
    //Update a contact
    updateContact: async (req,res)=>{
        /* let params = {
                    idContact:1,
                    prenomContact:'testUPDATEContact',
                    nomContact:'testContact',
                    mailContact:'testContact',
                    telFixeContact:111,
                    telPortableContact:111,
                    fonctionContact:'testContact',
                    principal:true,
                }*/
        const body = req.body;
        console.log(body)
        let idContact = req.params.id;
        let telFixeContact = body.telFixeContact;
        let telPortableContact = body.telPortableContact;
        if(isNaN(idContact)){
            utils.sendErrorNumber(req,res,Object.keys({idContact})[0])
        }
        else if(isNaN(telFixeContact)){
            utils.sendErrorNumber(req,res,Object.keys({telFixeContact})[0])
        }
        else if(isNaN(telPortableContact)){
            utils.sendErrorNumber(req,res,Object.keys({telPortableContact})[0])
        }else{
            await Contact.updateContact(idContact,body.prenomContact,body.nomContact,body.mailContact,body.telFixeContact,body.telPortableContact,body.fonctionContact,body.principal)
                .then(()=>{
                    res.status(201).json({updated:true})
                }).catch((error)=>{
                    res.status(503).json({
                        error:error,
                        updated:false
                    })
                })
        }


    },
    //Delete a contact
    deleteContact: async (req,res)=>{
        let idContact = req.params.id;
        if(isNaN(idContact)){
            utils.sendErrorNumber(req,res,Object.keys({idContact})[0])
        }else{
            await Contact.deleteContact(idContact)
                .then(()=>{
                    res.status(201).json({deleted:true})
                }).catch((error)=>{
                    res.status(503).json({
                        error:error,
                        deleted:false
                    })
                })
        }

    }

}
