import useAxios from "../utils/useAxios";
import {Alert, Button, Col, Input, Label, Row} from "reactstrap";
import Waiting from "../components/utils/Waiting";
import WorkFlowSelector from "../components/utils/WorkFlowSelector";
import axios from "axios";
import token from "../utils/token";
import React, {useState} from "react";
import pdf from "../utils/pdf";
import ReservationEmplacements from "../components/reservation/reservationEmplacements";
import ReservationJeuxReserves from "../components/reservation/reservationJeuxReserves";

function ReservationDetail(props) {
    const {
        data: info,
        setData: setInfo,
        isPending,
        err
    } = useAxios("/api/gestion/reservations/" + props.match.params.id)
    const [error, setError] = useState(false)

    const updateReservation = (id, data, value) => {
        axios.put("/api/gestion/reservations/" + info.idReservation, data, {headers: {Authorization: token.getToken()}})
            .then(() => {
                setError(false)
                switch (id) {
                    case "datePaiementFactureReservation":
                        setInfo({...info, payeReservation: value !== "", [id]: value})
                        break;
                    case "datePremierContactReservation":
                        if (value !== "") {
                            setInfo({...info, workflowReservation: '1', [id]: value})
                        } else {
                            setInfo({...info, [id]: value})
                        }
                        break;
                    case "dateSecondContactReservation":
                        if (value !== "") {
                            setInfo({...info, workflowReservation: '2', [id]: value})
                        } else {
                            setInfo({...info, [id]: value})
                        }
                        break;
                    default:
                        setInfo({...info, [id]: value})
                }
            })
            .catch(() => {
                setError(true)
                if (err.response.data.code === 0) {
                    token.destroyToken()
                }
            })
    }

    const handleChanges = async (event) => {
        let data = {}
        let value = event.target.value
        data[event.target.id] = value
        updateReservation(event.target.id, data, value)
    }

    const handleSelector = async (event, value) => {
        let data = {}
        data[event.target.id] = value
        updateReservation(event.target.id, data, value)
    }

    // Used to reset the date
    const resetDate = (id) => {
        let data = {}
        data[id] = ""
        updateReservation(id, data, "")
    }

    // We update the data on the view
    const updateData = (data, remiseReservation, prixReservation) => {
        const newInfo = {...info}
        newInfo.remiseReservation = remiseReservation
        newInfo.prixReservation = prixReservation
        newInfo.espace = data
        setInfo(newInfo)
    }

    // Udate the view when we change the prototype of a game
    const updateGameReservation = (val, idJeu) => {
        const newInfo = {...info}
        let changedGame = info.jeuPresents.filter(g => g.PK_idJeu === idJeu)[0]
        let indexOfGame = info.jeuPresents.indexOf(changedGame)
        newInfo.jeuPresents[indexOfGame].prototype = val
        setInfo(newInfo)
    }

    // Change the zone of a game
    const changeZoneJeu = (idJeu, idZone) => {
        const newInfo = {...info}
        let changedGame = info.jeuPresents.filter(g => g.PK_idJeu === idJeu)[0]
        let indexOfGame = info.jeuPresents.indexOf(changedGame)
        newInfo.jeuPresents[indexOfGame].PK_idZone = idZone
        setInfo(newInfo)
    }

    const addNewZoneGameReservation = (colName, newGame) => {
        const newInfo = {...info}
        newInfo[colName].push(newGame)
        setInfo(newInfo)
    }

    const deleteGameReservation = (gameToDelete) => {
        const newInfo = {...info}
        newInfo.jeuPresents = newInfo.jeuPresents.filter(g => gameToDelete.PK_idJeu !== g.PK_idJeu)
        setInfo(newInfo)
    }

    return (
        <div className="container justify-content-center">
            {error && <Alert color="danger">
                Erreur lors du changement des données, veuillez recharger la page et réessayer
            </Alert>}
            <Row className="mb-5 mt-5">
                <Col>
                    <h1 className="font-weight-900">Détail de la Réservation</h1>
                </Col>
            </Row>

            {isPending ? <Waiting/> :
                <div>
                    <div className="d-flex justify-content-between">
                        <h2 className="font-weight-600">Au nom de : {info.nomPersonne} </h2>
                        <div>

                        </div>
                        <div>
                            <Button onClick={() => {
                                pdf.createPDF(info)
                            }} className="btn-icon btn-3" color="danger" type="button">
                              <span className="btn-inner--icon">
                                <i className="ni ni-paper-diploma"/>
                              </span>
                                <span className="btn-inner--text">Facture</span>
                            </Button>
                        </div>
                    </div>
                    <hr/>
                    <Row>

                        <Col md={5}>
                            <Row className="mt-3 font-weight-400">
                                <h3>Informations</h3>
                            </Row>
                            <Row className="justify-content-center">
                                <p className="mb-1 mt-2">Etat de la Réservation</p>
                                <WorkFlowSelector disabled={token.getType() !== 1} selected={info.workflowReservation}
                                                  id="workflowReservation"
                                                  handleChanges={handleChanges}/>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="mt-2">
                                        <p className="mb--1">Placé</p>
                                        <label className="custom-toggle">
                                            <input id="estPlaceReservation"
                                                   type="checkbox"
                                                   disabled={token.getType() !== 1}
                                                   checked={info.estPlaceReservation}
                                                   onChange={(event) => handleSelector(event, !(info.estPlaceReservation))}/>
                                            <span className="custom-toggle-slider rounded-circle"/>
                                        </label>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mt-2">
                                        <p className="mb--1">Déplace</p>
                                        <label className="custom-toggle">
                                            <input id="seDeplaceReservation"
                                                   type="checkbox"
                                                   checked={info.seDeplaceReservation}
                                                   disabled={token.getType() !== 1}
                                                   onChange={(event) => handleSelector(event, !info.seDeplaceReservation)}/>
                                            <span className="custom-toggle-slider rounded-circle"/>
                                        </label>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mt-2">
                                        <p className="mb--1">Bénévoles</p>
                                        <label className="custom-toggle">
                                            <input id="besoinAnimateurReservation"
                                                   type="checkbox"
                                                   disabled={token.getType() !== 1}
                                                   checked={info.besoinAnimateurReservation}
                                                   onChange={(event) => handleSelector(event, !(info.besoinAnimateurReservation))}/>
                                            <span className="custom-toggle-slider rounded-circle"/>
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="mt-2">
                                        <p className="mb--1">Jeux amenés</p>
                                        <label className="custom-toggle">
                                            <input id="jeuxRecuReservation"
                                                   type="checkbox"
                                                   disabled={token.getType() !== 1}
                                                   checked={info.jeuxRecuReservation}
                                                   onChange={(event) => handleSelector(event, !(info.jeuxRecuReservation))}/>
                                            <span className="custom-toggle-slider rounded-circle"/>
                                        </label>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mt-2">
                                        <p className="mb--1">Jeux reçus</p>
                                        <label className="custom-toggle">
                                            <input id="jeuxAmenesReservation"
                                                   type="checkbox"
                                                   disabled={token.getType() !== 1}
                                                   checked={info.jeuxAmenesReservation}
                                                   onChange={(event) => handleSelector(event, !(info.jeuxAmenesReservation))}/>
                                            <span className="custom-toggle-slider rounded-circle"/>
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                            {token.getType() === 1 &&
                            <Row className="mt-3 font-weight-400">
                                <h3>Commentaires</h3>
                            </Row>}
                        </Col>
                        <Col md={2}>
                        </Col>
                        <Col md={5}>
                            <Row className="mt-3 font-weight-400">
                                <h3>Contact</h3>
                            </Row>
                            <Row className="mt-2">
                                <Label for="datePremierContactReservation">
                                    Date 1er Contact
                                </Label>
                            </Row>
                            <Row className="mt-1">
                                <Col>
                                    <Input type="date"
                                           name="datePremierContactReservation"
                                           id="datePremierContactReservation"
                                           disabled={token.getType() !== 1}
                                           value={info.datePremierContactReservation ? new Date(info.datePremierContactReservation).toISOString().slice(0, 10) : ""}
                                           onChange={(event) => handleChanges(event)}/>
                                </Col>
                                {token.getType() === 1 &&
                                <Col>
                                    <Button onClick={() => resetDate("datePremierContactReservation")}>
                                        Réinitialiser
                                    </Button>
                                </Col>}
                            </Row>
                            <Row className="mt-2">
                                <Label for="dateSecondContactReservation">
                                    Date 2nd Contact
                                </Label>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    <Input type="date"
                                           name="dateSecondContactReservation"
                                           id="dateSecondContactReservation"
                                           disabled={token.getType() !== 1}
                                           value={info.dateSecondContactReservation ? new Date(info.dateSecondContactReservation).toISOString().slice(0, 10) : ""}
                                           onChange={(event) => handleChanges(event)}/>
                                </Col>
                                {token.getType() === 1 &&
                                <Col>
                                    <Button onClick={() => resetDate("dateSecondContactReservation")}>
                                        Réinitialiser
                                    </Button>
                                </Col>}
                            </Row>
                            <Row className="mt-3 font-weight-400">
                                <h3>Facturation</h3>
                            </Row>
                            <Row className="mt-2">
                                <Label for="dateEnvoiFactureReservation">
                                    Envoi Facture
                                </Label>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    <Input type="date"
                                           name="dateEnvoiFactureReservation"
                                           id="dateEnvoiFactureReservation"
                                           disabled={token.getType() !== 1}
                                           value={info.dateEnvoiFactureReservation ? new Date(info.dateEnvoiFactureReservation).toISOString().slice(0, 10) : ""}
                                           onChange={(event) => handleChanges(event)}/>
                                </Col>
                                {token.getType() === 1 &&
                                <Col>
                                    <Button onClick={() => resetDate("dateEnvoiFactureReservation")}>
                                        Réinitialiser
                                    </Button>
                                </Col>}
                            </Row>
                            <Row className="mt-2">
                                <Label for="datePaiementFactureReservation">
                                    Paiement Facture
                                </Label>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    <Input type="date"
                                           name="datePaiementFactureReservation"
                                           id="datePaiementFactureReservation"
                                           disabled={token.getType() !== 1}
                                           value={info.datePaiementFactureReservation ? new Date(info.datePaiementFactureReservation).toISOString().slice(0, 10) : ""}
                                           onChange={(event) => handleChanges(event)}/>
                                </Col>
                                {token.getType() === 1 &&
                                <Col>
                                    <Button onClick={() => resetDate("datePaiementFactureReservation")}>
                                        Réinitialiser
                                    </Button>
                                </Col>}
                            </Row>
                        </Col>
                    </Row>
                    <hr/>
                    {!isPending ?
                        <ReservationEmplacements info={info}
                                                 updateData={updateData}/> : <Waiting/>}
                    <hr/>
                    <ReservationJeuxReserves info={info}
                                             deleteGameReservation={deleteGameReservation}
                                             addNewZoneGameReservation={addNewZoneGameReservation}
                                             updateGameReservation={updateGameReservation}
                                             changeZoneJeu={changeZoneJeu}
                                             updateReservation={updateReservation}/>
                </div>
            }
        </div>
    )
}

export default ReservationDetail;
