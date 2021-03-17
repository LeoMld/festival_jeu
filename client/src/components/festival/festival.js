import React, {useState} from 'react'

import {
    Table,
    Button,
    Col,
    Row
} from 'reactstrap';

import CreateUpdateFestival from "./createUpdateFestival";

function Festival(props) {

    const [modalState, setModalState] = useState(false)
    const [festival] = useState(props.festival)

    return (
        <div
            className={"container justify-content-center table-bordered table-striped table-active" + (festival.currentFestival ?
                ' border-darker' : ' border-light')}>
            <Row>
                <Col>
                    <h2 className="font-weight-bold font-italic">{festival.nameFestival}</h2>
                </Col>
                <Col className="mt-2">
                    {!festival.currentFestival ? <Button
                        outline
                        onClick={() => {
                            props.changeCurrentFestival(festival.idFestival)
                        }}>
                        Définir Festival Courant
                    </Button> : <p className="text-primary font-weight-bold">Ce festival est le festival courant</p>}
                </Col>
            </Row>
            <Table className="table-light">
                <thead>
                <tr>
                    <th rowSpan={2}>Espace</th>
                    <th rowSpan={2}>Nombre de tables</th>
                    <th colSpan={2}>Prix</th>
                    <th colSpan={2}>Réservés</th>
                    <th rowSpan={2}>Restent</th>
                </tr>
                <tr>
                    <th>Par tables</th>
                    <th>Par m²</th>
                    <th>Par tables</th>
                    <th>Par m²</th>
                </tr>
                </thead>
                <tbody>
                {festival.emplacements && festival.emplacements.map((emplacement) => {
                    return (
                        <tr>
                            <td>{emplacement.libelleEmplacement}</td>
                            <td>{emplacement.nombreTablesPrevues}</td>
                            <td>{emplacement.coutTable}</td>
                            <td>{emplacement.coutMetreCarre}</td>
                            <td>{emplacement.numberTables}</td>
                            <td>{emplacement.numberSquareMeters}</td>
                            <td>{emplacement.availableTables}</td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
            <Button
                className="mb-3"
                outline
                color="default"
                type="button"
                onClick={() => setModalState(!modalState)}
            >
                Modifier
            </Button>
            <CreateUpdateFestival modalState={modalState} setModalState={setModalState} componentState={1}/>
        </div>
    )
}

export default Festival