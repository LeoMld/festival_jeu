const Contact = require("../models/contactModel")
const Person = require("../models/personModel")
const utils = require("../utils/utils");
const Games = require("../models/jeuxModel")
const Reservation = require("../models/reservationModel")
const checkPersonInputs = async (data)=>{
    let person = data
    let error= {
        nbError: 0,
        nomPersonne: false,
        adressePersonne: false,
        statutEditeur: false,
    }

    if(person.nomPersonne===""){
        error.nomPersonne=true
        error.nbError+=1

    }if(person.statutEditeur==="" && person.estEditeur===true){
        error.statutEditeur=true
        error.nbError+=1

    }
    if(person.adressePersonne===""){
        error.adressePersonne=true
        error.nbError+=1

    }
    if(person.estEditeur===false) {
        const games = await Games.getEditorGames(person.idPersonne)
        if (games.length !== 0) {
            error.estEditeur = true
            error.nbError += 1
        }
    }
    if(person.estExposant===false){
        const reservations = await Reservation.getPersonReservations(person.idPersonne)
        if(reservations.length!==0) {
            error.estExposant = true
            error.nbError += 1
        }
    }
    console.log(error)
    return error
}
const checkInputs = async (data)=>{
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
        telPortableContact : false,
        estEditeur:false,
        estExposant:false,
    }
    let contact=data.contact
    let person = data.person
    if(person.nomPersonne===""){
        error.nomPersonne=true
        error.nbError+=1

    }if(person.statutEditeur==="" && person.estEditeur===true){
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
            console.log(err)
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
    getPersonPage : async (req,res)=>{
        let idEditor = req.params.id;
        if(isNaN(idEditor)){
            utils.sendErrorNumber(req,res,Object.keys({idEditor})[0])
        }else{
            let info = {}
            let error={}
            //retrieve the person info
            await Person.getPerson(idEditor)
                .then((result)=>{
                    info.person=result;
                }).catch(err=>{
                    error.person=err
                })
            if(info.person!==undefined){
                //retrieve his contacts
                await Contact.getContactsOf(idEditor)
                    .then((result)=>{
                        info.contacts=result
                    })
                    .catch((err)=>{
                        error.contacts=err

                    })
                if(info.person.estEditeur){
                    await Games.getEditorGames(idEditor)
                        .then((result)=>{
                            info.games=result
                        }).catch((err)=>{
                            error.games = err
                        })
                }
                if(info.person.estExposant){
                    await Reservation.getPersonReservations(idEditor)
                        .then((result)=>{
                            info.reservations=result
                        })
                        .catch(err=>{
                            error.reservations=err
                        })
                }
                if(error.person !== undefined || error.contacts !== undefined ||error.games !== undefined || error.reservations !== undefined){
                    res.status(503).json(error)
                }else{
                    res.status(200).json(info)
                }
            }else{
                res.status(404).json({msg:"Mauvaise requete"})
            }

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
                res.status(200).json(result)
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

    getPerson :async (req,res)=>{
        let idPerson =req.params.id
        await Person.getPerson(idPerson)
            .then((result)=>{
               res.status(200).json(result);
            }).catch(err=>{
                res.status(503).json(err);
            })
    },

    //======================== CREATE ========================
    createPerson : async (req,res)=>{

        let body = req.body;
        let person = body.person
        let contact = body.contact
        let error=await checkInputs(body)
        console.log(error)
        if(error.nbError!==0){
            console.log("wtf")
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
        console.log(body)
        console.log(req.params)
        if(body.nomPersonne!==undefined){
            let err = await checkPersonInputs(body)
            if(err.nbError!==0){
                console.log(err)
                res.status(400).json(err)

            }else{
                console.log("Strange")
                await Person.updatePerson(req.params.id,body.nomPersonne, body.adressePersonne, body.statutEditeur, body.estEditeur, body.exposantInactif, body.estExposant)
                    .then(()=>{
                        res.status(200).json({updated: true})
                    }).catch((err)=>{
                        res.status(503).json({updated: false})
                    })
            }

        }else if(body.estEditeur!==undefined){
            console.log("Ok")
            if(body.estEditeur===true){
                await updatePersonEditeur(req, res)
            }else{
                const games = await Games.getEditorGames(req.params.id)
                if (games.length===0){
                    await updatePersonEditeur(req, res)
                }else{
                    res.status(400).json({updated:false})
                }
            }
        }else if(body.estExposant!==undefined){
            console.log("Wtf")
            const reservations = await Reservation.getPersonReservations(req.params.id)
            if(reservations.length===0) {

                await updatePersonExposant(req, res).catch((err) => {
                    res.status(503).json({updated: false})

                })
            }else{
                res.status(400).json({updated:false})
        }
        }else if(body.exposantInactif!==undefined){
            console.log("Wait")
            await updatePersonInactif(req, res).catch((err)=>{
              res.status(503).json({updated: false})

          })
        }
    },

}
