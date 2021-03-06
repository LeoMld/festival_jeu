import {Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, Row} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import token from "../../utils/token";

function ContactModal(props){
    const [contacts,setContacts]=useState(props.info.contacts)

    const initError={
        nbError:0,
        nomContact:false,
        prenomContact:false,
        mailContact:false,
        fonctionContact:false,
        telFixeContact:false,
        telPortableContact : false
    }
    const [errorDetail,setErrorDetail]=useState(initError)
    const [contact,setContact]=useState(props.contact!==undefined?props.contact:{
        nomContact:"",
        prenomContact:"",
        mailContact:"",
        fonctionContact:"",
        telFixeContact:"",
        telPortableContact : ""
    })
    useEffect(()=>{
        setContact(props.contact?props.contact: {
            idPersonne:props.info.person.idPersonne,
            nomContact: "",
            prenomContact: "",
            mailContact: "",
            fonctionContact: "",
            telFixeContact: "",
            telPortableContact: "",
            principal:false
        })
        setUpdate(props.state)
    },[props.contact,props.state])
    const [update,setUpdate]=useState(props.state !== 0)

   const initContactNull = ()=>{
        setContact({
            idPersonne:props.info.person.idPersonne,
            nomContact: "",
            prenomContact: "",
            mailContact: "",
            fonctionContact: "",
            telFixeContact: "",
            telPortableContact: "",
            principal:false
        })
    }
    const handleAdd = () =>{
        axios.post("/api/gestion/contact",contact,{headers:{Authorization:token.getToken()}})
            .then((res) =>
            {
                props.setInfo({...props.info,contacts:res.data})
                initContactNull()
                setErrorDetail(initError)
                props.setModalState(!props.modalState)
                props.initError()
            })
            .catch(e=>{
                if(e.response && e.response.data.code === 0){
                    token.destroyToken()
                }
                setErrorDetail(e.response.data)
            })
    }
    const getElement =(id)=>{
        let check=false
        let i=0
        let index;
        while (i<contacts.length || !check ) {
            if(contacts[i].idContact===id){
                check=true
                index=i
            }
            i++
        }
        return index
    }
    const handleUpdate =()=>{
        axios.put("/api/gestion/contact/"+contact.idContact,contact,{headers:{Authorization:token.getToken()}})
            .then((res)=>{
                //retrouver le contact dans l'array
                let index=getElement(contact.idContact)
                let newContacts = [...contacts]
                if(contact.principal){
                    newContacts.forEach(c=>c.principal=false)
                }
                newContacts[index]=contact
                let localInfo = props.info
                localInfo.contacts=newContacts
                props.setInfo(localInfo)
                setUpdate(false)
                setErrorDetail(initError)
            })
            .catch(e=>{
                if(e.response && e.response.data.code === 0){
                    token.destroyToken()
                }
                setErrorDetail(e.response.data)
            })
    }
    const handleDelete = async ()=>{
        axios.delete("/api/gestion/contact/"+contact.idContact,{headers:{Authorization:token.getToken()}})
            .then(()=>{
                // We remove the contact
                const reNewContacts = props.info.contacts.filter(item => item.idContact !== parseInt(contact.idContact))
                // We update the contacts
                props.setInfo({...props.info,contacts:reNewContacts})
                props.setModalState(false)

            })

    }

    return(
        <div>
            <Modal toggle={
                () => {
                    props.setModalState(!props.modalState)
                    props.initError()
                }
            } isOpen={props.modalState}>

                <div className=" modal-header">
                    <h5 className=" modal-title" id="exampleModalLabel">
                        Contact
                    </h5>
                </div>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col className="w-50 mt-2" >
                                <Label for="nom">Nom</Label>
                                <Input
                                    id="nom"
                                    name="nomContact"
                                    disabled={!update}
                                    className={errorDetail.nomContact ? "is-invalid" :""}
                                    value={contact.nomContact}
                                    onChange={(event)=>{setContact({...contact,nomContact:event.target.value})}}
                                    placeholder="Nom Contact"
                                    type="text"
                                />
                            </Col>
                            <Col className="w-50 mt-2">
                                <Label for="prenom">Pr??nom</Label>
                                <Input
                                    id="prenom"
                                    name="prenomContact"
                                    disabled={!update}
                                    className={errorDetail.prenomContact ? "is-invalid" :""}
                                    value={contact && contact.prenomContact}
                                    onChange={(event)=>{setContact({...contact,prenomContact:event.target.value})}}
                                    placeholder="Pr??nom"
                                    type="text"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mt-2">
                                <Label for="mail">Email</Label>
                                <Input
                                    id="mail"
                                    name="mailContact"
                                    disabled={!update}
                                    className={errorDetail.mailContact ? "is-invalid" :""}
                                    value={contact && contact.mailContact}
                                    onChange={(event)=>{setContact({...contact,mailContact:event.target.value})}}
                                    placeholder="Mail"
                                    type="text"
                                />
                            </Col>
                            <Col className="mt-2">
                                <Label for="fonction">Fonction</Label>
                                <Input
                                    id="fonction"
                                    name="fonctionContact"
                                    disabled={!update}
                                    className={errorDetail.fonctionContact ? "is-invalid" : ""}
                                    value={contact && contact.fonctionContact}
                                    onChange={(event)=>{setContact({...contact,fonctionContact:event.target.value})}}
                                    placeholder="Fonction"
                                    type="text"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="w-50 mt-2">
                                <Label for="telPortableContact">T??l??phone Portable</Label>
                                <Input
                                    id="telPortableContact"
                                    name="telPortableContact"
                                    disabled={!update}
                                    className={errorDetail.telPortableContact ? "is-invalid" : ""}
                                    value={contact && contact.telPortableContact}
                                    onChange={(event)=>{setContact({...contact,telPortableContact:event.target.value})}}
                                    placeholder="T??l??phone Portable"
                                    type="text"
                                />
                            </Col>
                            <Col className="w-50 mt-2">
                                <Label for="telFixeContact">T??l??phone Fixe</Label>
                                <Input
                                    id="telFixeContact"
                                    name="telFixeContact"
                                    disabled={!update}
                                    className={errorDetail.telFixeContact ? "is-invalid" :""}
                                    value={contact && contact.telFixeContact}
                                    onChange={(event)=>{setContact({...contact,telFixeContact:event.target.value})}}
                                    placeholder="T??l??phone Fixe"
                                    type="text"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mt-2">
                                <Label> Contact Principal</Label>
                                <div className="mt--1">
                                    <label className="custom-toggle">
                                        <input
                                            name="estExposant"
                                            onChange={(event)=> {
                                            setContact({...contact,principal: !(contact.principal)})
                                        }}
                                            disabled={!update}
                                            type="checkbox"
                                            checked={contact && contact.principal}/>
                                        <span className="custom-toggle-slider rounded-circle"></span>
                                    </label>
                                </div>

                            </Col>
                        </Row>

                    </Form>
                </ModalBody>
                <ModalFooter>
                    {update &&
                    <div>
                        <Button color="success" type="button" onClick={()=>{
                            if(props.contact){
                                handleUpdate()
                            }else{
                                handleAdd()
                            }
                    }}>
                        Valider
                    </Button>
                         <Button color="danger" type="button" onClick={()=>{
                            if(props.state===1){
                                initContactNull()
                                props.setModalState(!props.modalState)

                            }else{
                                setContact(props.contact)
                                setUpdate(false)
                                props.setModalState(!props.modalState)
                            }
                        }}>
                            Annuler
                        </Button>
                    </div>}
                    {!update && token.getType()===1 &&
                        <div>
                            <Button color="danger" type="button" onClick={()=>{handleDelete()}}>
                                Supprimer
                            </Button>
                            <Button color="primary" type="button" onClick={()=>{setUpdate(true)}}>
                                Modifier
                            </Button>

                        </div>
                    }

                </ModalFooter>
            </Modal>
        </div>
    )
}
export default ContactModal;
