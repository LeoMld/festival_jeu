const Contact = require('../models/contactModel')

module.exports ={
    //retrieve all contact from a person
    getAllContact: async (req,res)=>{
        let idPersone=req.params.idPersone;
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
    },
    //Create a contact linked to a person
    createContact: async (req,res)=>{
        const params = req.params;
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
        await Contact.createContact(params.prenomContact,params.nomContact,params.mailContact,params.telFixeContact,params.telPortableContact,params.fonctionContact,params.principal,params.idPersonne)
            .then(()=>{
                res.status(201).json({inserted:true})
            }).catch((error)=>{
                res.status(503).json({
                    error:error,
                    inserted:false
                })
            })
    },
    //Update a contact
    updateContact: async (req,res)=>{
        const params = req.params;
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
        await Contact.updateContact(params.idContact,params.prenomContact,params.nomContact,params.mailContact,params.telFixeContact,params.telPortableContact,params.fonctionContact,params.principal)
            .then(()=>{
                res.status(201).json({updated:true})
            }).catch((error)=>{
                res.status(503).json({
                    error:error,
                    updated:false
                })
            })
    },
    //Delete a contact
    deleteContact: async (req,res)=>{
        const params = req.params;
        /*let params = {
            idContact:2
        }*/
        await Contact.deleteContact(params.idContact)
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