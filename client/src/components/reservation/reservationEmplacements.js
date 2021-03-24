import React, {useState} from "react";

import {Alert, Button, Input, Row, Table} from "reactstrap";
import Axios from "axios";
import token from "../../utils/token";
import Waiting from "../utils/Waiting";

function ReservationEmplacements(props) {

    // In case there is no spaces yet
    const initEspaces = () => {
        const nbEmplacements = props.emplacements.length
        let espaces = [nbEmplacements]
        for (let i = 0; i < nbEmplacements; i++) {
            const emptySpace = {
                ["nombreTables" + i]: 0,
                ["metreCarres" + i]: 0,
                idEmplacement: props.emplacements[i].idEmplacement
            }
            espaces[i] = emptySpace
        }
        return espaces
    }

    const [remiseReservation, setRemiseReservation] = useState(props.remiseReservation)
    const [inputsEspaces, setInputsEspaces] = useState(props.espaces.length === 0 ? initEspaces() : props.espaces)

    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    // Display the total of each col
    const displayTotal = (colName) => {
        const nbEmplacements = props.emplacements.length
        let tot = 0
        try {
            for (let i = 0; i < nbEmplacements; i++) {
                const float = parseFloat(document.getElementById(colName + i).value)
                tot += float
            }
            return tot.toFixed(2)
        } catch (err) {
            if (props.espaces.length === 0) {
                return (0).toFixed(2)
            } else {
                tot = 0
                for (let i = 0; i < nbEmplacements; i++) {
                    const float = parseFloat(props.espaces[i][colName])
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
        const prixTable = props.emplacements[index].coutTable
        const prixMetreCarres = props.emplacements[index].coutMetreCarre
        try {
            const nbTables = parseFloat(document.getElementById("nombreTables" + index).value)
            const nbMetreCarres = parseFloat(document.getElementById("metreCarres" + index).value)
            return (nbTables * prixTable + nbMetreCarres * prixMetreCarres).toFixed(2)
        } catch (err) {
            if (props.espaces.length === 0) {
                return (0).toFixed(2)
            } else {
                const nbTables = parseFloat(props.espaces[index].nombreTables)
                const nbMetreCarres = parseFloat(props.espaces[index].metreCarres)
                return (nbTables * prixTable + nbMetreCarres * prixMetreCarres).toFixed(2)
            }
        }
    }

    // Total of the price
    const allPrice = () => {
        const nbEmplacements = props.emplacements.length
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
            idReservation: props.idReservation,
            inputsEspaces,
            remiseReservation,
            prixReservation
        }
        Axios.post('/api/gestion/reservation', data, {headers: {Authorization: token.getToken()}})
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
        console.log(inputsEspaces[0].nombreTables)
        console.log(inputsEspaces)
    }

    return (
        <Row className="mt-2">
            <div>
                <h3 className="font-weight-500">Réserver des emplacements</h3>
            </div>
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
                {props.emplacements.map((emp, index) => {
                    return (
                        <tr key={index}>
                            <td className="align-middle">{emp.libelleEmplacement}</td>
                            <td className="align-middle">
                                <Input
                                    type="text"
                                    id={'nombreTables' + index}
                                    value={props.espaces.length === 0 ? inputsEspaces[index]["nombreTables" + index] : inputsEspaces[index].nombreTables}
                                    onChange={(event) => {
                                        props.espaces.length === 0 ?
                                            handleChangeEmp(event, 'nombreTables' + index, index) :
                                            handleChangeEmp(event, 'nombreTables', index)
                                    }}
                                />
                            </td>
                            <td className="align-middle">
                                <Input
                                    type="text"
                                    id={'metreCarres' + index}
                                    value={props.espaces.length === 0 ? inputsEspaces[index]["metreCarres" + index] : inputsEspaces[index].metreCarres}
                                    onChange={(event) => {
                                        props.espaces.length === 0 ?
                                            handleChangeEmp(event, 'metreCarres' + index, index) :
                                            handleChangeEmp(event, 'metreCarres', index)
                                    }}
                                />
                            </td>
                            <td className="align-middle">
                                {displayPrice(index)}€
                            </td>
                        </tr>
                    )
                })}
                <tr className="table-active">
                    <th className="align-middle">Totaux (sans remise)</th>
                    <th className="align-middle">{displayTotal("nombreTables")}</th>
                    <th className="align-middle">{displayTotal("metreCarres")}</th>
                    <th className="align-middle">{allPrice()}€</th>
                </tr>
                <tr>
                    <td className="align-middle">Remise</td>
                    <td className="align-middle" colSpan={2}>
                        <Input
                            type="text"
                            id="remiseReservation"
                            value={remiseReservation}
                            onChange={(event) => setRemiseReservation(event.target.value)}
                        />
                    </td>
                    <td className="align-middle">- {remiseReservation}€</td>
                </tr>
                <tr className="table-active">
                    <th>Ancien Prix Total</th>
                    <th>{props.prixReservation}€</th>
                    <th className="align-middle">Totaux (avec remise)</th>
                    <th className="align-middle">{(allPrice() - remiseReservation).toFixed(2)}€</th>
                </tr>
                </tbody>
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
                                        onClick={props.espaces.length === 0 ? () => {
                                            saveNewEmplacements()
                                        } : () => {
                                            saveChanges()
                                        }}>
                                    Enregistrer
                                </Button> :
                                <Waiting/>)}
                    </td>
                </tr>
                </tfoot>
            </Table>
        </Row>
    )
}

export default ReservationEmplacements;