import React, {useState, useEffect} from 'react'

import {
    Table,
    Button,
    Col,
    Row,
    Alert
} from 'reactstrap';

import CreateUpdateFestival from "./createUpdateFestival";
import Waiting from "../utils/Waiting";

function Festival(props) {


    const [modalState, setModalState] = useState(false)
    const [festival, setFestival] = useState(props.festival)
    // Used to only have the spinner on the clicked festival
    const [click, setClick] = useState(false)

    // We change the festival
    useEffect(() => {
        !props.isChanging && (setClick(false))
        setFestival(props.festival)
    })

    // TODO Change the festival the user wants to see
    const changeFestivalToSee = () => {

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
                        ((props.errorChanging === null || festival.idFestival !== props.errorChanging.idFestival) ? (((props.isChanging && click) ?
                            <Waiting/> :
                            <Button
                                outline
                                color="primary"
                                onClick={() => {
                                    setClick(true)
                                    props.changeCurrentFestival(festival.idFestival)
                                }}>
                                Définir Festival Courant
                            </Button>)) :
                            <Alert color="danger">
                                {props.errorChanging.message}
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
                <tr className="">
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
                <Button
                    className="mb-3"
                    outline
                    disabled={props.festivalToSee.idFestival === festival.idFestival}
                    color="default"
                    type="button"
                    onClick={() => changeFestivalToSee()}
                >
                    Voir ce festival
                </Button>

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