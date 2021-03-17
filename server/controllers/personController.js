const Contact = require("../models/contactModel")
const Person = require("../models/personModel")
const utils = require("../utils/utils");

module.exports = {
    //======================== GETTER ========================

    //retrieve all the editor's info and his contacts
    getEditorPage : async (req,res)=>{
        let idEditor = req.params.id;
        if(isNaN(idEditor)){
            utils.sendErrorNumber(req,res,Object.keys({idEditor})[0])
        }else{
            let info = {}
            await Person.getPerson(idEditor)
                .then((result)=>{
                    info=result;
                }).catch(error=>{
                    res.status(503).json({error: error})
                })
            await Contact.getContactsOf(idEditor)
                .then((result)=>{
                    if(result.length===0){
                        info.contacts="No Contacts"
                        res.status(200).json(info)
                    }else{
                        info.contacts=result
                        res.status(200).json(info)
                    }
                })
                .catch((error)=>{
                    res.status(503).json({error: error})
                })
        }
    },
    getAllEditors: async (req,res)=>{
        await Person.getEditeurs()
            .then((result)=>{
                if(result.length===0){
                    res.status(200).json({message:"Pas d'éditeurs dans la Base de données"})
                }else{
                    res.status(200).json({editeurs: result})
                }
            })
            .catch(error=>{
                res.status(503).json({error: error})
            })
    },
    getAllExposants: async (req,res)=>{
        await Person.getExposants()
            .then((result)=>{
                if(result.length===0){
                    res.status(200).json({message:"Pas d'éditeurs dans la Base de données"})
                }else{
                    res.status(200).json({exposants: result})
                }
            })
            .catch(error=>{
                res.status(503).json({error: error})
            })
    },
    //======================== CREATE ========================
    createPerson : async (req,res)=>{
        let body = req.body;

        await Person.createPerson(body.nomPersonne, body.adressePersonne, body.statutEditeur,
            body.estEditeur, body.exposantInactif,
            body.estExposant, body.prenomContact,
            body.nomContact, body.mailContact,
            body.telFixeContact, body.telPortableContact,
            body.fonctionContact, body.principal)
            .then(()=>{
                res.status(200).json({inserted: true})
            }).catch(err=>{
                res.status(503).json({inserted: false})
            })
    },


    //======================== UPDATE ========================
    updatePerson : async (req,res)=>{
      let body = req.body;
      await updatePerson(body.idPersonne,body.nomPersonne, body.adressePersonne, body.statutEditeur, body.estEditeur, body.exposantInactif, body.estExposant)
          .then(()=>{
              res.status(200).json({updated: true})
          }).catch(err=>{
              res.status(503).json({updated: false})
          })
    },
    updatePersonInactif : async (req,res)=>{
        let body = req.body;
        await Person.updatePersonInactif(body.idPersonne,body.exposantInactif)
            .then(()=>{
                res.status(200).json({updated: true})
            }).catch(err=>{
                res.status(503).json({updated: false})
            })
    },
    updatePersonEditeur : async (req,res)=>{
        let body = req.body;
        await Person.updatePersonEditeur(body.idPersonne,body.estEditeur)
            .then(()=>{
                res.status(200).json({updated: true})
            }).catch(err=>{
                res.status(503).json({updated: false})
            })
    },
    updatePersonExposant : async (req,res)=>{
        let body = req.body;
        await Person.updatePersonExposant(body.idPersonne,body.estExposant)
            .then(()=>{
                res.status(200).json({updated: true})
            }).catch(err=>{
                res.status(503).json({updated: false})
            })
    }
}
