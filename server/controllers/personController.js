const Contact = require("../models/contactModel")
const Person = require("../models/personModel")
const utils = require("../utils/utils");


const checkInputs = (data)=>{
    let error={
        nbError:0,
        nomPersonne:false,
        adressePersonne:false,
        statutEditeur:false,
        nomContact:false,
        prenomContact:false,
        mailContact:false,
        fonctionContact:false,
        telFixeContact:false,
        telPortableContact : false
    }
    let contact=data.contact
    let person=data.person
    //TODO REGEX sur mail et téléphone
    if(isNaN(parseInt(contact.telFixeContact))){
        error.telFixeContact=true
        error.nbError+=1
    }
    if(isNaN(parseInt(contact.telPortableContact))){
        error.telPortableContact=true
        error.nbError+=1

    }
    if(person.nomPersonne===""){
        error.nomPersonne=true
        error.nbError+=1

    }if(person.statutEditeur==="" && data.type===1){
        error.statutEditeur=true
        error.nbError+=1

    }
    if(person.adressePersonne===""){
        error.adressePersonne=true
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

const updatePersonInactif = async (req,res)=>{
    let body = req.body;
    await Person.updatePersonInactif(req.params.id,body.exposantInactif)
        .then(()=>{
            res.status(200).json({updated: true})
        }).catch(err=>{
            res.status(503).json({updated: false})
        })
}
const  updatePersonEditeur = async (req,res)=>{
    let body=req.body
    await Person.updatePersonEditeur(req.params.id,body.estEditeur)
        .then(()=>{
            res.status(200).json({updated: true})
        }).catch(err=>{
            res.status(503).json({updated: false})
        })
}
const updatePersonExposant = async (req,res)=>{
    let body = req.body;
    await Person.updatePersonExposant(req.params.id,body.estExposant)
        .then(()=>{
            res.status(200).json({updated: true})
        }).catch(err=>{
            res.status(503).json({updated: false})
        })
}
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
                    res.status(200).json(result)
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
                    res.status(200).json("Pas d'éditeurs dans la Base de données")
                }else{
                    res.status(200).json(result)
                }
            })
            .catch(error=>{
                res.status(503).json({error: error})
            })
    },

    getAllPersons: async (req,res)=>{
        await Person.getAllPersons()
            .then((result)=>{
                if(result.length===0){
                    res.status(200).json("Pas de personne")
                }else{
                    res.status(200).json(result)
                }
            })
            .catch(error=>{
                res.status(503).json({error: error})
            })
    },

    //======================== CREATE ========================
    createPerson : async (req,res)=>{

        let body = req.body;
        let person = body.person
        let contact = body.contact
        let error=checkInputs(body)
        if(error.nbError!==0){
            res.status(400).json(error)
        }
        else{
            await Person.createPerson(person.nomPersonne, person.adressePersonne, person.statutEditeur,
                person.estEditeur, person.exposantInactif,
                person.estExposant, contact.prenomContact,
                contact.nomContact, contact.mailContact,
                contact.telFixeContact, contact.telPortableContact,
                contact.fonctionContact, contact.principal)
                .then((result)=>{
                    res.status(200).json({inserted: true,
                        person:result})
                }).catch(err=>{
                    res.status(503).json({inserted: false})
                })
        }

    },


    //======================== UPDATE ========================
    updatePerson : async (req,res)=>{
        let body = req.body;
        if(body.nomPersonne!==undefined){
          await Person.updatePerson(body.idPersonne,body.nomPersonne, body.adressePersonne, body.statutEditeur, body.estEditeur, body.exposantInactif, body.estExposant)
              .then(()=>{
                  res.status(200).json({updated: true})
              }).catch((err)=>{
                  res.status(503).json({updated: false})
              })
        }else if(body.estEditeur!==undefined){

            await updatePersonEditeur(req, res)
              .catch((err)=>{
                  console.log("Erreur lors du changement " + err)
                  res.status(503).json({updated: false})

              })
        }else if(body.estExposant!==undefined){
          await updatePersonExposant(req, res).catch((err)=>{
              console.log("Erreur lors du changement " + err)
              res.status(503).json({updated: false})

          })
        }else if(body.exposantInactif!==undefined){
            await updatePersonInactif(req, res).catch((err)=>{
              console.log("Erreur lors du changement " + err)
              res.status(503).json({updated: false})

          })
        }
    },

}
