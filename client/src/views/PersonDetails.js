import React, {useState} from "react";
import axios from "axios";
import useAxios from "../utils/useAxios";
import {Button, Card, CardBody, Col, Collapse, Input, Label, Row, Table} from "reactstrap";
import Waiting from "../components/utils/Waiting";
import token from "../utils/token";
import Contact from "../components/contact/contact";
import ContactModal from "../components/contact/contactModal";
import Game from "../components/game/Game";
import ModalNewGame from "../components/game/ModalNewGame";

//TODO FIX PROTOTYPE JEUX

function PersonDetails(props) {
    const getPerson = ()=>{
        axios.get("/api/gestion/personne/" + props.match.params.idPerson, {headers: {Authorization: token.getToken()}})
            .then((res) => {
                return res.data
            }).catch(err => {
            //if the token is not the good one
            if (err.response && err.response.code === 0) {
                token.destroyToken()
            }
        })
    }

    let typePerson = props.type === 1 ? "editeurs" : "exposants"
    const {
        data: info,
        setData: setInfo,
        isPending,
        error
    } = useAxios("/api/gestion/" + typePerson + "/" + props.match.params.idPerson)
    //state for the collapse

    const initError = ()=> {return{
            nbError: 0,
            nomPersonne: false,
            adressePersonne: false,
            statutEditeur: false,
    }}

    const [editPerson, setEditPerson] = useState(false)
    const [errorDetail, setErrorDetail] = useState(initError)
    const [openDetail, setOpenDetail] = useState(true)
    const [openContact, setOpenContact] = useState(false)
    const [openJeux, setOpenJeux] = useState(false)
    const [openReservation, setOpenReservation] = useState(false)
    const toggle = (collapse) => {
        switch (collapse) {
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
    let [modalState, setModalState] = useState(false)
    let [modalStateAddGame,setModalStateAddGame] =useState(false)


    let [contact, setContact] = useState()
    const handleSubmit = () => {
        let localPerson={
            idPersonne:info.person.idPersonne,
            nomPersonne:document.getElementById("nomPersonne").value,
            adressePersonne:document.getElementById("adressePersonne").value,
            statutEditeur:document.getElementById("statutEditeur").value,
            estEditeur:document.getElementById("estEditeur").checked,
            estExposant:document.getElementById("estExposant").checked,
            exposantInactif:document.getElementById("exposantInactif").checked
        }
        console.log(localPerson)
        axios.put("/api/gestion/" + typePerson + "/" + props.match.params.idPerson, localPerson,{headers: {Authorization: token.getToken()}})
            .then((res) => {
                setEditPerson(!editPerson)
            })
            .catch(e => {
                if (e.response && e.response.data.code === 0) {
                    token.destroyToken()
                }
                setErrorDetail(e.response.data)
            })
    }
    const handleCancel = ()=>{
        let person = info.person
        document.getElementById("nomPersonne").value=person.nomPersonne
        document.getElementById("adressePersonne").value=person.adressePersonne
        document.getElementById("statutEditeur").value=person.statutEditeur
        document.getElementById("estEditeur").checked=person.estEditeur
        document.getElementById("estExposant").checked=person.estExposant
        document.getElementById("exposantInactif").checked=person.exposantInactif
        setEditPerson(!editPerson)
    }
    //0 : Update
    // 1: create
    const [state, setState] = useState(0)
    const openModal = (contact, state) => {
        setState(state)
        setContact(contact)
        setModalState(true)
    }
    return (

            <div>
                {isPending && <div className="justify-content-center mt-9"><Waiting/></div>}
                {info &&
                <div className=" justify-content-center">
                    <div>
                        <Row className="mb-5 mt-5">
                            <Col>
                                <h1 className="font-weight-900">{info.person.nomPersonne}</h1>
                            </Col>
                        </Row>
                        <Row className="m-2">
                            <Col className="w-50">
                                <Button color="link" onClick={() => setOpenDetail(!openDetail)}
                                        className=" w-100 text-primary text-center border">Informations</Button>
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
                                                    onClick={
                                                        handleCancel
                                                    }
                                                >Annuler </Button>
                                            </div>

                                            }
                                            {!editPerson && <Button
                                                color="default"
                                                type="button"
                                                onClick={() => setEditPerson(!editPerson)}
                                            >
                                                Editer
                                            </Button>}

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
                                                            defaultValue={info.person.nomPersonne}
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
                                                            defaultValue={info.person.adressePersonne}
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
                                                            defaultValue={info.person.statutEditeur}
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
                                                                disabled={!editPerson}
                                                                type="checkbox"
                                                                defaultChecked={info.person.estEditeur}/>
                                                            <span className="custom-toggle-slider rounded-circle"/>
                                                        </label>
                                                    </div>
                                                </Col>
                                                <Col className="mt-2">
                                                    <div>
                                                        <p className="mb--1">Exposant</p>
                                                        <label className="custom-toggle">
                                                            <Input
                                                                id="estExposant"
                                                                disabled={!editPerson}
                                                                type="checkbox"
                                                                defaultChecked={info.person.estExposant}/>
                                                            <span className="custom-toggle-slider rounded-circle"/>
                                                        </label>
                                                    </div>
                                                </Col>
                                                <Col className="mt-2">
                                                    <div>
                                                        <p className="mb--1">Exposant Inactif</p>
                                                        <label className="custom-toggle">
                                                            <Input
                                                                id="exposantInactif"
                                                                disabled={!editPerson}
                                                                type="checkbox"
                                                                defaultChecked={info.person.exposantInactif}/>
                                                            <span className="custom-toggle-slider rounded-circle"/>
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </Col>
                            <Col>
                                <Button color="link" onClick={() => setOpenContact(!openContact)}
                                        className=" w-100 text-primary text-center border">Contact</Button>
                                <Collapse isOpen={openContact}>
                                    <Card>
                                        <CardBody>
                                            <div>
                                                <Button
                                                    className="mb-2"
                                                    color="default"
                                                    type="button"
                                                    onClick={() => openModal(null, 1)}
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
                                                {info.contacts.map((c, index) => {
                                                    return (<Contact c={c} openModal={openModal} key={index}
                                                                     index={index}/>)
                                                })}
                                                </tbody>
                                            </Table>
                                            <ContactModal setInfo={setInfo} info={info} modalState={modalState}
                                                          setModalState={setModalState} contact={contact}
                                                          state={state} initError={initError}/>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </Col>
                        </Row>
                        {info.games &&
                        <Row className="m-2 inline-flex">
                            {info.games.length !== 0 &&
                            <Col className="w-50 p-2">
                                <Button color="link" onClick={() => setOpenJeux(!openJeux)}
                                        className=" w-100 text-primary text-center border">Jeux</Button>
                                <Collapse isOpen={openJeux}>
                                    <Card>
                                        <CardBody>
                                            {token.getType() === 1 &&
                                            <Button onClick={() => setModalStateAddGame(!modalStateAddGame)
                                            } color="success" outline type="button">
                                                Ajouter un jeu
                                            </Button>}
                                            <table className="table table-striped">
                                                <thead>
                                                <tr>
                                                    <th className="text-center">#</th>
                                                    <th>Titre</th>
                                                    <th className="d-none d-lg-table-cell">Nombre de joueurs</th>
                                                    <th className="d-none d-lg-table-cell">Âge minimum</th>
                                                    <th className="d-none d-lg-table-cell">Durée</th>
                                                    <th className="d-none d-lg-table-cell">Type</th>
                                                    {token.getType() === 1 && <th>Prototype</th>}
                                                    {token.getType() === 1 && <th>Action</th>}

                                                </tr>
                                                </thead>
                                                <tbody>
                                                {info.games.map((g, index) => {
                                                    return (
                                                        <Game games={info} setGames={setInfo} index={index} game={g}
                                                              type={1}/>
                                                    )
                                                })
                                                }
                                                </tbody>
                                            </table>


                                        </CardBody>
                                    </Card>
                                </Collapse>
                                {info.games && modalStateAddGame && token.getType() === 1 &&
                                <ModalNewGame setGames={setInfo} games={info} modalState={modalStateAddGame}
                                              setModalState={setModalStateAddGame} type={1}/>}
                            </Col>}

                        </Row>
                        }
                        {info.reservations && <Row>"hi"</Row>}



                    </div>
                </div>
                }

            </div>
        )
}


export default PersonDetails;
