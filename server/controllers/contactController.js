const Contact = require('../models/contactModel')
const utils = require("../utils/utils");

const checkContactInputs = (contact)=>{
    let error={
        nbError:0,
        nomContact:false,
        prenomContact:false,
        mailContact:false,
        fonctionContact:false,
        telFixeContact:false,
        telPortableContact : false
    }
    //TODO REGEX sur mail et téléphone
    if(isNaN(parseInt(contact.telFixeContact))){
        error.telFixeContact=true
        error.nbError+=1
    }
    if(isNaN(parseInt(contact.telPortableContact))){
        error.telPortableContact=true
        error.nbError+=1

    }
    if(contact.nomContact===""){
        error.nomContact=true
        error.nbError+=1

    }
    if(contact.prenomContact===""){
        error.prenomContact=true
        error.nbError+=1


    }
    if(contact.mailContact===""){
        error.mailContact=true
        error.nbError+=1

    }
    if(contact.fonctionContact===""){
        error.fonctionContact=true
        error.nbError+=1

    }
    return error
}
module.exports ={
    //retrieve all contact from a person
    /*getAllContact: async (req,res)=>{
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
        let err=checkContactInputs(body)
        if(err.nbError){
            res.status(400).json(err)
        }
        else{
            await Contact.createContact(body.prenomContact,body.nomContact,body.mailContact,body.telFixeContact,body.telPortableContact,body.fonctionContact,body.principal,body.idPersonne)
                .then((result)=>{
                    res.status(201).json(result)
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
        if(req.body.telPortableContact!==undefined){
            const body = req.body;
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
                await Contact.updateContact(idContact,body.prenomContact,body.nomContact,body.mailContact,body.telFixeContact,body.telPortableContact,body.fonctionContact,body.principal,body.FK_idPersonne)
                    .then(()=>{
                        res.status(200).json({updated:true})
                    }).catch((error)=>{
                        res.status(503).json({
                            error:error,
                            updated:false
                        })
                    })
            }
        }else if (req.body.principal!==undefined){
            let body = req.body
            await Contact.updatePrincipal(body.idPersonne,req.params.id,body.principal).then(()=>{
                res.status(200).json({updated:true})
            }).catch((e)=>{
                res.status(503).json({
                    error:e,
                    updated:false
                })
            })
        }else{
            res.status(400).json({msg:"Données invalides"})
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
