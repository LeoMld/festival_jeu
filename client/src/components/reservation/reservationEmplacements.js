import React, {useState} from "react";

import {Alert, Button, Input, Row, Table} from "reactstrap";
import Axios from "axios";
import token from "../../utils/token";
import Waiting from "../utils/Waiting";

function ReservationEmplacements(props) {

    // In case there is no spaces yet
    const initEspaces = () => {
        const nbEmplacements = props.info.emplacements.length
        let espaces = [nbEmplacements]
        for (let i = 0; i < nbEmplacements; i++) {
            const emptySpace = {
                ["nombreTables" + i]: 0,
                ["metreCarres" + i]: 0,
                idEmplacement: props.info.emplacements[i].idEmplacement
            }
            espaces[i] = emptySpace
        }
        return espaces
    }

    const [remiseReservation, setRemiseReservation] = useState(props.info.remiseReservation)
    const [inputsEspaces, setInputsEspaces] = useState(props.info.espace.length === 0 ? initEspaces() : props.info.espace)

    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    // Display the total of each col
    const displayTotal = (colName) => {
        const nbEmplacements = props.info.emplacements.length
        let tot = 0
        try {
            for (let i = 0; i < nbEmplacements; i++) {
                const float = parseFloat(document.getElementById(colName + i).value)
                tot += float
            }
            return tot.toFixed(2)
        } catch (err) {
            if (props.info.espace.length === 0) {
                return (0).toFixed(2)
            } else {
                tot = 0
                for (let i = 0; i < nbEmplacements; i++) {
                    const float = parseFloat(props.info.espace[i][colName])
                    tot += float
                }
                return tot.toFixed(2)
            }
        }
    }

    // Handle the changes on the emplacements inputs
    const handleChangeEmp = (event, field, index) => {
        let newInputs = [...inputsEspaces]
        newInputs[index][field] = event.target.value
        setInputsEspaces(newInputs)
    }

    // Display the price of a row
    const displayPrice = (index) => {
        const prixTable = props.info.emplacements[index].coutTable
        const prixMetreCarres = props.info.emplacements[index].coutMetreCarre
        try {
            const nbTables = parseFloat(document.getElementById("nombreTables" + index).value)
            const nbMetreCarres = parseFloat(document.getElementById("metreCarres" + index).value)
            return (nbTables * prixTable + nbMetreCarres * prixMetreCarres).toFixed(2)
        } catch (err) {
            if (props.info.espace.length === 0) {
                return (0).toFixed(2)
            } else {
                const nbTables = parseFloat(props.info.espace[index].nombreTables)
                const nbMetreCarres = parseFloat(props.info.espace[index].metreCarres)
                return (nbTables * prixTable + nbMetreCarres * prixMetreCarres).toFixed(2)
            }
        }
    }

    // Total of the price
    const allPrice = () => {
        const nbEmplacements = props.info.emplacements.length
        let tot = 0
        for (let i = 0; i < nbEmplacements; i++) {
            const float = parseFloat(displayPrice(i))
            tot += float
        }
        return tot.toFixed(2)
    }

    // Check if we only have numbers
    const ready = () => {
        return isNaN((allPrice() - remiseReservation))
    }

    // Save the new reserved spaces in the database
    const saveNewEmplacements = () => {
        setIsPending(true)
        const prixReservation = (allPrice() - remiseReservation).toFixed(2)
        // The data we need to send
        const data = {
            idReservation: props.info.idReservation,
            inputsEspaces,
            remiseReservation,
            prixReservation
        }
        Axios.post('/api/gestion/espacesReserves', data, {headers: {Authorization: token.getToken()}})
            .then(({data}) => {
                // We need to update the parent component
                props.updateData(data, remiseReservation, prixReservation)
                setIsPending(false)
            })
            .catch((err) => {
                setError(err.message)
                setIsPending(false)
            })
    }

    // We change the information of the reserved spaces of the reservation
    const saveChanges = () => {
        setIsPending(true)
        const prixReservation = (allPrice() - remiseReservation).toFixed(2)
        // The data we need to send
        const data = {
            inputsEspaces,
            remiseReservation,
            prixReservation
        }
        Axios.put('/api/gestion/espacesReserves/' + props.info.idReservation, data, {headers: {Authorization: token.getToken()}})
            .then(() => {
                // It's okay
                props.updateData(inputsEspaces, remiseReservation, prixReservation)
                setIsPending(false)
            })
            .catch((err) => {
                setError(err.message)
                setIsPending(false)
            })
    }

    return (
        <Row className="mt-2">
            <h3 className="font-weight-600 mb-3">Réserver des emplacements</h3>
            <Table className="table  table-bordered">
                <thead className="table-light">
                <tr>
                    <th rowSpan={2} className="align-middle">Emplacement</th>
                    <th colSpan={2} className="align-middle">Réservation</th>
                    <th rowSpan={2} className="align-middle">Prix</th>
                </tr>
                <tr>
                    <th>Tables</th>
                    <th>m²</th>
                </tr>
                </thead>
                <tbody>
                {props.info.emplacements.map((emp, index) => {
                    return (
                        <tr key={index}>
                            <td className="align-middle">{emp.libelleEmplacement}</td>
                            <td className="align-middle">
                                <Input
                                    type="text"
                                    id={'nombreTables' + index}
                                    value={props.info.espace.length === 0 ? inputsEspaces[index]["nombreTables" + index] : inputsEspaces[index].nombreTables}
                                    disabled={props.info.payeReservation || token.getType() !== 1}
                                    onChange={(event) => {
                                        props.info.espace.length === 0 ?
                                            handleChangeEmp(event, 'nombreTables' + index, index) :
                                            handleChangeEmp(event, 'nombreTables', index)
                                    }}
                                />
                            </td>
                            <td className="align-middle">
                                <Input
                                    type="text"
                                    id={'metreCarres' + index}
                                    value={props.info.espace.length === 0 ? inputsEspaces[index]["metreCarres" + index] : inputsEspaces[index].metreCarres}
                                    disabled={props.info.payeReservation || token.getType() !== 1}
                                    onChange={(event) => {
                                        props.info.espace.length === 0 ?
                                            handleChangeEmp(event, 'metreCarres' + index, index) :
                                            handleChangeEmp(event, 'metreCarres', index)
                                    }}
                                />
                            </td>
                            <td className="align-middle">
                                {isNaN(displayPrice(index)) ? (0).toFixed(2) : displayPrice(index)}€
                            </td>
                        </tr>
                    )
                })}
                <tr className="table-active">
                    <th className="align-middle">Totaux (sans remise)</th>
                    <th className="align-middle">{isNaN(displayTotal("nombreTables")) ? (0).toFixed(2) : displayTotal("nombreTables")}</th>
                    <th className="align-middle">{isNaN(displayTotal("metreCarres")) ? (0).toFixed(2) : displayTotal("metreCarres")}</th>
                    <th className="align-middle">{isNaN(allPrice()) ? (0).toFixed(2) : allPrice()}€</th>
                </tr>
                <tr>
                    <td className="align-middle">Remise</td>
                    <td className="align-middle" colSpan={2}>
                        <Input
                            type="text"
                            id="remiseReservation"
                            value={remiseReservation}
                            disabled={props.info.payeReservation || token.getType() !== 1}
                            onChange={(event) => setRemiseReservation(event.target.value)}
                        />
                    </td>
                    <td className="align-middle">- {remiseReservation}€</td>
                </tr>
                <tr className="table-active">
                    <th>Ancien Prix Total</th>
                    <th>{props.info.prixReservation}€</th>
                    <th className="align-middle">Totaux (avec remise)</th>
                    <th className="align-middle">{isNaN(allPrice() - remiseReservation) ? (0).toFixed(2) : (allPrice() - remiseReservation).toFixed(2)}€</th>
                </tr>
                </tbody>
                {(!props.info.payeReservation && token.getType() === 1) &&
                <tfoot>
                <tr>
                    <td className="mt-3 align-middle" colSpan={4}>
                        {error ?
                            <Alert color="danger">
                                {error}
                            </Alert> :
                            (!isPending ?
                                <Button size="sm"
                                        outline
                                        color="default"
                                        disabled={ready()}
                                        block
                                        onClick={props.info.espace.length === 0 ? () => {
                                            saveNewEmplacements()
                                        } : () => {
                                            saveChanges()
                                        }}>
                                    Enregistrer
                                </Button> :
                                <Waiting/>)}
                    </td>
                </tr>
                </tfoot>}
                {props.info.payeReservation &&
                <tfoot>
                <tr className="table-success">
                    <td colSpan={5} className="font-weight-800">
                        Cette réservation a déjà été payée
                    </td>
                </tr>
                </tfoot>}
            </Table>
        </Row>
    )
}

export default ReservationEmplacements;