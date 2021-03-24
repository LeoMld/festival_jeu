import useAxios from "../utils/useAxios";
import {Alert, Button, Col, Input, Label, Row, Table} from "reactstrap";
import Waiting from "../components/utils/Waiting";
import WorkFlowSelector from "../components/utils/WorkFlowSelector";
import axios from "axios";
import token from "../utils/token";
import React, {useState} from "react";
import pdf from "../utils/pdf";
import ReservationEmplacements from "../components/reservation/reservationEmplacements";

function ReservationDetail(props) {
    const {
        data: info,
        setData: setInfo,
        isPending,
        err
    } = useAxios("/api/gestion/reservations/" + props.match.params.id)
    const [error, setError] = useState(false)

    const handleChanges = async (event) => {
        let data = {}
        let value = event.target.value
        data[event.target.id] = value
        axios.put("/api/gestion/reservations/" + info.idReservation, data, {headers: {Authorization: token.getToken()}})
            .then((res) => {
                setInfo({...info, [event.target.id]: value})
                setError(false)
            })
            .catch(() => {
                setError(true)
            })
    }

    const handleSelector = async (event, val) => {
        let data = {}
        data[event.target.id] = val
        setInfo({...info, [event.target.id]: val})

        axios.put("/api/gestion/reservations/" + info.idReservation, data, {headers: {Authorization: token.getToken()}})
            .then((res) => {
                setInfo({...info, [event.target.id]: val})
                setError(false)
            })
            .catch(() => {
                setError(true)
            })
    }

    // We update the data on the view
    const updateData = (data, remiseReservation, prixReservation) => {
        const newInfo = {...info}
        newInfo.remiseReservation = remiseReservation
        newInfo.prixReservation = prixReservation
        newInfo.espace = data
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

            {isPending && <Waiting/>}
            {info &&
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

                    <Col md={4}>
                        <Row className="justify-content-center ">
                            <p className="mb--1">Etat de la Réservation</p>
                            <WorkFlowSelector selected={info.workflowReservation} id="workflowReservation"
                                              handleChanges={handleChanges}/>
                        </Row>
                        <div className="justify-content-center mt-2 ">
                            <p className="mb--1">Placé:</p>
                            <label className="custom-toggle">
                                <input id="estPlaceReservation"
                                       type="checkbox"
                                       checked={info.estPlaceReservation}
                                       onChange={(event) => handleSelector(event, !(info.estPlaceReservation))}/>
                                <span className="custom-toggle-slider rounded-circle"/>
                            </label>
                        </div>
                        <div>
                            <p className="mb--1">Déplace:</p>
                            <label className="custom-toggle">
                                <input id="seDeplaceReservation"
                                       type="checkbox"
                                       checked={info.seDeplaceReservation}
                                       onChange={(event) => handleSelector(event, !info.seDeplaceReservation)}/>
                                <span className="custom-toggle-slider rounded-circle"/>
                            </label>
                        </div>
                        <div>
                            <p className="mb--1">Bénévoles:</p>
                            <label className="custom-toggle">
                                <input id="besoinAnimateurReservation"
                                       type="checkbox"
                                       checked={info.besoinAnimateurReservation}
                                       onChange={(event) => handleSelector(event, !(info.besoinAnimateurReservation))}/>
                                <span className="custom-toggle-slider rounded-circle"/>
                            </label>
                        </div>
                    </Col>
                    <Col md={3}>

                    </Col>
                    <Col md={5}>
                        <Row className="mt-1">
                            <Label for="datePremierContactReservation">
                                Date 1er Contact
                            </Label>
                            <Input type="date"
                                   name="datePremierContactReservation"
                                   id="datePremierContactReservation"
                                   value={info.datePremierContactReservation ? new Date(info.datePremierContactReservation).toISOString().slice(0, 10) : ""}

                                   onChange={(event) => handleChanges(event)}/>
                        </Row>

                        <Row className="mt-2">
                            <Label for="dateSecondContactReservation">
                                Date 2nd Contact
                            </Label>
                            <Input type="date"
                                   name="dateSecondContactReservation"
                                   id="dateSecondContactReservation"
                                   value={info.dateSecondContactReservation ? new Date(info.dateSecondContactReservation).toISOString().slice(0, 10) : ""}

                                   onChange={(event) => handleChanges(event)}/>
                        </Row>
                        <Row className="mt-2">
                            <Label for="dateEnvoiFactureReservation">
                                Envoi Facture
                            </Label>
                            <Input type="date"
                                   name="dateEnvoiFactureReservation"
                                   id="dateEnvoiFactureReservation"
                                   value={info.dateEnvoiFactureReservation ? new Date(info.dateEnvoiFactureReservation).toISOString().slice(0, 10) : ""}
                                   onChange={(event) => handleChanges(event)}/>
                        </Row>
                        <Row className="mt-2">
                            <Label for="datePaiementFactureReservation">
                                Paiement Facture
                            </Label>
                            <Input type="date"
                                   name="datePaiementFactureReservation"
                                   id="datePaiementFactureReservation"
                                   value={info.datePaiementFactureReservation ? new Date(info.datePaiementFactureReservation).toISOString().slice(0, 10) : ""}
                                   onChange={(event) => handleChanges(event)}/>
                        </Row>

                    </Col>
                </Row>
                <hr/>
                {!isPending ?
                    <ReservationEmplacements espaces={info.espace} emplacements={info.emplacements}
                                             prixReservation={info.prixReservation}
                                             remiseReservation={info.remiseReservation}
                                             idReservation={info.idReservation}
                                             updateData={updateData}/> : <Waiting/>}
            </div>
            }
        </div>
    )
}

export default ReservationDetail;
