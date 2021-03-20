import {
    Button, Col, Form, Input, Label,
    Modal, ModalBody, ModalFooter, Row

} from "reactstrap"
import {useState} from "react";
import axios from "axios";
function CreatePerson(props) {
    let person = props.type===1?"Editeur":"Exposant"

    const [personDetail,setPersonDetail] = useState({
        nomPersonne:"",
        adressePersonne:"",
        statutEditeur:"",
        estEditeur:props.type === 1,
        estExposant:props.type===0,
        exposantInactif:false
    })
    const [contactDetail,setContactDetail]=useState({
        nomContact:"",
        prenomContact:"",
        mailContact:"",
        telPortableContact:"",
        telFixeContact:"",
        fonctionContact:"",
        principal:false
    })
    const [errorDetail,setErrorDetail]=useState({
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
    })
    const defaultValues = ()=>{
        setPersonDetail({
            nomPersonne:"",
            adressePersonne:"",
            statutEditeur:"",
            estEditeur:props.type === 1,
            estExposant:props.type===0,
            exposantInactif:false
        })
        setContactDetail({
            nomContact:"",
            prenomContact:"",
            mailContact:"",
            telPortableContact:"",
            telFixeContact:"",
            fonctionContact:"",
            principal:false
        })
        setErrorDetail({
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
        })
    }

    const createPerson = ()=>{
        axios.post("/api/gestion/editeurs",{
            type:props.type,
            person:personDetail,
            contact:contactDetail
        }).then((result)=>{
            props.addPerson(result.data.person)
            defaultValues()
        }).catch((error)=>{
            setErrorDetail(error.response.data)
        })

    }
    return(
        <div>
            <Modal toggle={() => props.setModalState(!props.modalState)} isOpen={props.modalState}>

                <div className=" modal-header">
                    <h5 className=" modal-title" id="exampleModalLabel">
                        Nouvel {person}
                    </h5>
                </div>
                <ModalBody>
                    <Form>
                        <Row>
                          <Col>
                              <div className="mt--1">
                                  <Label for="nomPersonne">{"Nom" + person}</Label>
                                  <Input
                                      id="nomPersonne"
                                      name="nomPersonne"
                                      placeholder={"Nom "+person}
                                      className={errorDetail.nomPersonne && "is-invalid"}
                                      value={personDetail.nomPersonne}
                                      onChange={(event)=>{setPersonDetail({...personDetail,nomPersonne:event.target.value})}}
                                      type="text"
                                  />
                              </div>
                              <div className="mt-2">
                                  <Label for="adressePersonne">{"Adresse" + person}</Label>
                                  <Input
                                      id="adressePersonne"
                                      name="adressePersonne"
                                      className={errorDetail.adressePersonne && "is-invalid"}
                                      value={personDetail.adressePersonne}
                                      onChange={(event)=>{setPersonDetail({...personDetail,adressePersonne:event.target.value})}}
                                      placeholder="Adresse"
                                      type="text"
                                  />
                              </div >
                              { props.type === 1 && <div className="mt-2">
                                  <Label for="statutEditeur">{"Taille" + person}</Label>
                                  <Input
                                      id="statutEditeur"
                                      name="statutEditeur"
                                      className={errorDetail.statutEditeur && "is-invalid"}
                                      value={personDetail.statutEditeur}
                                      onChange={(event)=>{setPersonDetail({...personDetail,statutEditeur:event.target.value})}}
                                      placeholder="Taille"
                                      type="text"
                                  />
                              </div>
                             }
                          </Col>
                            <Row>
                                <Col className="mt-2">
                                    <Label> Editeur</Label>
                                    <div className="mt--1">
                                        <label className="custom-toggle">
                                            <input name="estEditeur" onChange={()=> {setPersonDetail({...personDetail,estEditeur:(!personDetail.estEditeur)})}} checked={personDetail.estEditeur} type="checkbox" defaultChecked={personDetail.estEditeur}/>
                                            <span className="custom-toggle-slider rounded-circle"></span>
                                        </label>
                                    </div>
                                </Col>
                                <Col className="mt-2">
                                    <Label> Exposant</Label>
                                    <div className="mt--1">
                                        <label className="custom-toggle">
                                            <input name="estExposant" onChange={()=> {setPersonDetail({...personDetail,estExposant:(!personDetail.estExposant)})}} checked={personDetail.estExposant} type="checkbox" defaultChecked={personDetail.estExposant}/>
                                            <span className="custom-toggle-slider rounded-circle"></span>
                                        </label>
                                    </div>

                                </Col>
                            </Row>
                        </Row>
                        <Row>
                            <Col className="w-50 mt-2" >
                                <Label for="nom">Nom</Label>
                                <Input
                                id="nom"
                                name="nomContact"
                                className={errorDetail.nomContact && "is-invalid"}
                                value={contactDetail.nomContact}
                                onChange={(event)=>{setContactDetail({...contactDetail,nomContact:event.target.value})}}
                                placeholder="Nom Contact"
                                type="text"
                                />
                            </Col>
                            <Col className="w-50 mt-2">
                                <Label for="prenom">Prénom</Label>
                                <Input
                                    id="prenom"
                                    name="prenomContact"
                                    className={errorDetail.prenomContact && "is-invalid"}
                                    value={contactDetail.prenomContact}
                                    onChange={(event)=>{setContactDetail({...contactDetail,prenomContact:event.target.value})}}
                                    placeholder="Prénom Personne"
                                    type="text"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mt-2">
                                <Label for="mail">Email</Label>
                                <Input
                                    id="mail"
                                    name="mailContact"
                                    className={errorDetail.mailContact && "is-invalid"}
                                    value={contactDetail.mailContact}
                                    onChange={(event)=>{setContactDetail({...contactDetail,mailContact:event.target.value})}}
                                    placeholder="Mail"
                                    type="text"
                                />
                            </Col>
                            <Col className="mt-2">
                                <Label for="fonction">Fonction</Label>
                                <Input
                                    id="fonction"
                                    name="fonctionContact"
                                    className={errorDetail.fonctionContact && "is-invalid"}
                                    value={contactDetail.fonctionContact}
                                    onChange={(event)=>{setContactDetail({...contactDetail,fonctionContact:event.target.value})}}
                                    placeholder="Mail"
                                    type="text"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="w-50 mt-2">
                                <Label for="telPortableContact">Téléphone Portable</Label>
                                <Input
                                    id="telPortableContact"
                                    name="telPortableContact"
                                    className={errorDetail.telPortableContact && "is-invalid"}
                                    value={contactDetail.telPortableContact}
                                    onChange={(event)=>{setContactDetail({...contactDetail,telPortableContact:event.target.value})}}
                                    placeholder="Téléphone Portable"
                                    type="text"
                                />
                            </Col>
                            <Col className="w-50 mt-2">
                                <Label for="telFixeContact">Téléphone Fixe</Label>
                                <Input
                                    id="telFixeContact"
                                    name="telFixeContact"
                                    className={errorDetail.telFixeContact && "is-invalid"}
                                    value={contactDetail.telFixeContact}
                                    onChange={(event)=>{setContactDetail({...contactDetail,telFixeContact:event.target.value})}}
                                    placeholder="Téléphone Fixe"
                                    type="text"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mt-2">
                                <Label> Contact Principal</Label>
                                <div className="mt--1">
                                    <label className="custom-toggle">
                                        <input name="estExposant" onChange={(event)=> {
                                            setContactDetail({...contactDetail,principal: !(contactDetail.principal)})
                                        }} checked={contactDetail.principal} type="checkbox" defaultChecked={contactDetail.principal}/>
                                        <span className="custom-toggle-slider rounded-circle"></span>
                                    </label>
                                </div>

                            </Col>
                        </Row>

                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="button" onClick={createPerson} >
                        Créer {props.type===1?"Editeur":"Exposant"}
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
export default CreatePerson;
