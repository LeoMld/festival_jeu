import React, {useEffect, useState} from 'react'

import {Alert, Button, Col, Row, Table} from 'reactstrap';

import CreateUpdateFestival from "./createUpdateFestival";
import Waiting from "../utils/Waiting";
import Axios from "axios";
import token from "../../utils/token";

function Festival(props) {

    const [modalState, setModalState] = useState(false)
    const [festival, setFestival] = useState(props.festival)

    // Current festival management
    const [isChanging, setIsChanging] = useState(false)
    const [errorChanging, setErrorChanging] = useState(null)

    // festival to see management
    const [pendingFestivalToSee, setPendingFestivalToSee] = useState(false)
    const [errorFestivalToSee, setErrorFestivalToSee] = useState(null)

    // We change the festival
    useEffect(() => {
        setFestival(props.festival)
    })

    // Change the current festival to the one given in parameter
    const changeCurrentFestival = () => {
        setIsChanging(true)
        Axios.put('/api/gestion/festival/' + festival.idFestival, [], {headers: {Authorization: token.getToken()}})
            .then(() => {
                // We update the festivals here
                props.changeViewCurrentFestival(festival.idFestival)
                setErrorChanging(null)
                setIsChanging(false)
            })
            .catch(err => {
                setErrorChanging(err.message)
                setIsChanging(false)
                if (err.response.data.code === 0) {
                    token.destroyToken()
                }
            })
    }

    // We update the festival to see for the user
    const changeFestivalToSee = () => {
        setPendingFestivalToSee(true)
        Axios.put('/api/user/festival', {idFestival: festival.idFestival}, {headers: {Authorization: token.getToken()}})
            .then(() => {
                setPendingFestivalToSee(false)
                setErrorFestivalToSee(null)
                props.setFestivalToSee(festival)
            })
            .catch((err) => {
                setErrorFestivalToSee(err.message)
                setPendingFestivalToSee(false)
                if (err.response.data.code === 0) {
                    token.destroyToken()
                }
            })
    }

    return (
        <div
            className={"container justify-content-center table-bordered table-striped table-active" + (festival.currentFestival ?
                ' border-darker' : ' border-light')}>
            <Row>
                <Col>
                    <h2 className="font-weight-bold font-italic">{festival.nameFestival}</h2>
                </Col>
                <Col className="mt-2">
                    {!festival.currentFestival ?
                        (errorChanging === null ? (((isChanging) ?
                            <Waiting/> :
                            <Button
                                outline
                                color="primary"
                                onClick={() => {
                                    changeCurrentFestival()
                                }}>
                                Définir Festival Courant
                            </Button>)) :
                            <Alert color="danger">
                                {errorChanging}
                            </Alert>) :
                        <p className="text-primary font-weight-bold">Ce festival est le festival courant</p>}
                </Col>
            </Row>
            <Table className="table-light">
                <thead>
                <tr>
                    <th rowSpan={2}>Espace</th>
                    <th rowSpan={2}>Nombre de tables</th>
                    <th colSpan={2}>Prix</th>
                    <th colSpan={2}>Réservés</th>
                    <th rowSpan={2}>Reste</th>
                </tr>
                <tr>
                    <th>Par tables</th>
                    <th>Par m²</th>
                    <th>Par tables</th>
                    <th>Par m²</th>
                </tr>
                </thead>
                <tbody>
                {festival.emplacements && festival.emplacements.map((emplacement, index) => {
                    return (
                        <tr key={index}>
                            <td>{emplacement.libelleEmplacement}</td>
                            <td>{emplacement.nombreTablesPrevues}</td>
                            <td>{emplacement.coutTable}€</td>
                            <td>{emplacement.coutMetreCarre}€</td>
                            <td>{emplacement.numberTables}</td>
                            <td>{emplacement.numberSquareMeters}</td>
                            <td>{emplacement.availableTables}</td>
                        </tr>
                    )
                })}
                <tr>
                    <th>
                        Total :
                    </th>
                    <th>
                        {festival.numberTablesTotal}
                    </th>
                    <th colSpan={2}>
                        {festival.priceReservationTotal}€
                    </th>
                    <th>
                        {festival.numberTablesReservedTotal}
                    </th>
                    <th>
                        {festival.numberSquareMetersReservedTotal}
                    </th>
                    <th>
                        {festival.availableTotal}
                    </th>
                </tr>
                </tbody>
            </Table>
            <div className="btn-wrapper text-center mb-3">
                <Button
                    className="mb-3"
                    outline
                    color="default"
                    type="button"
                    onClick={() => setModalState(!modalState)}
                >
                    Modifier
                </Button>
                {errorFestivalToSee ? <Alert color="danger">
                        {errorFestivalToSee}
                    </Alert> :
                    <Button
                        className="mb-3"
                        outline
                        disabled={props.festivalToSee.idFestival === festival.idFestival}
                        color={pendingFestivalToSee ? "" : "default"}
                        type="button"
                        onClick={() => changeFestivalToSee()}
                    >
                        {pendingFestivalToSee ? <Waiting/> : 'Voir ce festival'}
                    </Button>}
            </div>
            <CreateUpdateFestival modalState={modalState}
                                  setModalState={setModalState}
                                  componentState={1}
                                  festival={festival}
                                  updateFestival={props.updateFestival}/>
        </div>
    )
}

export default Festival
