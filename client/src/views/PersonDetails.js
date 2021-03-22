import React, {useEffect, useState} from "react";
import axios from "axios";
import useAxios from "../utils/useAxios";
import {Button, Card, CardBody, CardHeader, Col, Collapse, Input, Label, Row, Table} from "reactstrap";
import Waiting from "../components/utils/Waiting";
import token from "../utils/token";
import Contact from "../components/contact/contact";
import ContactModal from "../components/contact/contactModal";


const PersonDetails=React.memo(function PersonDetails(props){
    const [localPerson,setLocalPerson] = useState(props.location.personProps)

    const initPersonDetail = ()=>{
        setLocalPerson(props.location.personProps)
    }
    let typePerson = props.type===1?"editeurs":"exposants"
    const{data:info,setData:setInfo,isPending,error}= useAxios("/api/gestion/"+typePerson+"/"+props.match.params.idPerson)
    //state for the collapse


    const [editPerson,setEditPerson]=useState(false)
    const [errorDetail,setErrorDetail]=useState({
        nbError:0,
        nomPersonne:false,
        adressePersonne:false,
        statutEditeur:false,
    })
    const [openDetail,setOpenDetail] = useState(true)
    const [openContact,setOpenContact] = useState(false)
    const [openJeux,setOpenJeux] = useState(false)
    const [openReservation,setOpenReservation] = useState(false)
    const toggle= (collapse)=>{
        switch (collapse){
            case "detail":
                setOpenDetail(!openDetail)
                break
            case "contact":
                setOpenContact(!openContact)
                break
            case "jeux":
                setOpenJeux(!openJeux)
                break
            case "reservations":
                setOpenReservation(!openReservation)
                break
        }
    }
    let [modalState,setModalState] = useState(false)
    let [contact,setContact] = useState()
    const updatePersonDetail = (event)=>{
        setLocalPerson({...localPerson,[event.target.id]:event.target.value})
    }
    const updateSelector = (event)=>{
        setLocalPerson({...localPerson,[event.target.id]:event.target.checked})

    }
    const handleSubmit = ()=>{
        for (const [key, value] of Object.entries(info.person)) {
            console.log(localPerson.hasOwnProperty(key))
            if(!(key in localPerson)){
                localPerson[key]=value
            }
        }
        setInfo({...info,person:localPerson})
        console.log(info)

        axios.put("/api/gestion/"+typePerson+"/"+props.match.params.idPerson,localPerson,{headers:{Authorization:token.getToken()}})
            .then((res)=>{
                setEditPerson(!editPerson)
            })
            .catch(e=>{
                if(e.response && e.response.data.code === 0){
                    token.destroyToken()
                }
                setErrorDetail(e)
            })
    }
    //0 : Update
    // 1: create
    const [state,setState] = useState(0)
    const openModal = (contact,state)=>{
        setState(state)
        setContact(contact)
        setModalState(true)
    }
    if(isPending){
        return (<Waiting/>)
    }
    else if(info!== null){
        return (

            <div>
                <div className=" justify-content-center">
                    <div>
                        <Row className="mb-5 mt-5">
                            <Col>
                                <h1 className="font-weight-900">{info.person.nomPersonne}</h1>
                            </Col>
                        </Row>
                        <Row className="m-2">
                            <Col className="w-50" >
                                <Button color="link" onClick={()=>setOpenDetail(!openDetail)} className=" w-100 text-primary text-center border">Informations</Button>
                                <Collapse isOpen={openDetail}>
                                    <Card>
                                        <CardBody>
                                                {editPerson && <div>
                                                    <Button
                                                        color="success"
                                                        type="button"
                                                        onClick={handleSubmit}
                                                    >Valider </Button>
                                                    <Button
                                                        color="danger"
                                                        type="button"
                                                        onClick={()=>{
                                                            initPersonDetail()
                                                            setEditPerson(!editPerson)}}
                                                    >Annuler </Button>
                                                </div>

                                                }
                                                {!editPerson && <Button
                                                    color="default"
                                                    type="button"
                                                    onClick={() => setEditPerson(!editPerson)}
                                                >
                                                    Editer
                                                </Button> }

                                            <Row>
                                                <Col>
                                                    <div>
                                                        <Label for="nomPersonne" className="mb--2">Nom</Label>
                                                        <Input
                                                            id="nomPersonne"
                                                            name="nomPersonne"
                                                            placeholder="Nom"
                                                            disabled={!editPerson}
                                                            className={errorDetail.nomPersonne ? "is-invalid" : ""}
                                                            value={localPerson.nomPersonne}
                                                            onChange={
                                                                (event) => {
                                                                    updatePersonDetail(event)
                                                                }}
                                                            type="text"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div>
                                                        <Label for="adressePersonne" className="mb--2">Adresse</Label>
                                                        <Input
                                                            id="adressePersonne"
                                                            name="adressePersonne"
                                                            placeholder="Adresse"
                                                            disabled={!editPerson}
                                                            className={errorDetail.adressePersonne ? "is-invalid" : ""}
                                                            value={localPerson.adressePersonne}
                                                            onChange={
                                                                (event) => {
                                                                    updatePersonDetail(event)
                                                                }}
                                                            type="text"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div>
                                                        <Label for="statutEditeur" className="mb--2">Taille</Label>
                                                        <Input
                                                            id="statutEditeur"
                                                            name="statutEditeur"
                                                            placeholder="Taille"
                                                            disabled={!editPerson}
                                                            className={errorDetail.statutEditeur ? "is-invalid" : ""}
                                                            value={localPerson.statutEditeur}
                                                            onChange={
                                                                (event) => {
                                                                    updatePersonDetail(event)
                                                                }}
                                                            type="text"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col className="mt-2">
                                                    <div>
                                                        <p className="mb--1">Editeur</p>
                                                        <label className="custom-toggle">
                                                            <Input
                                                                id="estEditeur"
                                                                onChange={(event)=> {updateSelector(event)}}
                                                                disabled={!editPerson}
                                                                type="checkbox"
                                                                checked={localPerson.estEditeur}/>
                                                            <span className="custom-toggle-slider rounded-circle"></span>
                                                        </label>
                                                    </div>
                                                </Col>
                                                <Col className="mt-2">
                                                    <div>
                                                        <p className="mb--1">Exposant</p>
                                                        <label className="custom-toggle">
                                                            <Input
                                                                id="estExposant"
                                                                onChange={(event)=> {updateSelector(event)}}
                                                                disabled={!editPerson}
                                                                type="checkbox"
                                                                checked={localPerson.estExposant}/>
                                                            <span className="custom-toggle-slider rounded-circle"></span>
                                                        </label>
                                                    </div>
                                                </Col>
                                                <Col className="mt-2">
                                                    <div>
                                                        <p className="mb--1">Exposant Inactif</p>
                                                        <label className="custom-toggle">
                                                            <Input
                                                                id="exposantInactif"
                                                                onChange={(event)=> {updateSelector(event)}}
                                                                disabled={!editPerson}
                                                                type="checkbox"
                                                                checked={localPerson.exposantInactif}/>
                                                            <span className="custom-toggle-slider rounded-circle"></span>
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </Col>
                            <Col>
                                <Button color="link" onClick={()=>setOpenContact(!openContact)} className=" w-100 text-primary text-center border">Contact</Button>
                                <Collapse isOpen={openContact}>
                                    <Card>
                                        <CardBody>
                                            <div>
                                                <Button
                                                    className="mb-2"
                                                    color="default"
                                                    type="button"
                                                    onClick={() => openModal(null,1)}
                                                >
                                                    Ajouter
                                                </Button>
                                            </div>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>Nom - Prenom</th>
                                                        <th>Mail</th>
                                                        <th>Téléphone Portable</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {info.contacts.map((c,index)=>{
                                                    return(<Contact c={c} openModal={openModal} index={index}/>)
                                                })}
                                                </tbody>
                                            </Table>
                                            <ContactModal setInfo={setInfo} info={info} modalState={modalState} setModalState={setModalState} contact={contact} state={state}/>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </Col>
                        </Row>



                    </div>
                </div>
            </div>
        )
    }
})


export default PersonDetails;
