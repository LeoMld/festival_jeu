import React, {useState} from "react";

import {Button, Input, Row, Table} from "reactstrap";
import Axios from "axios";

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
            return 0
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
        try {
            const nbTables = parseFloat(document.getElementById("nombreTables" + index).value)
            const nbMetreCarres = parseFloat(document.getElementById("metreCarres" + index).value)
            const prixTable = props.emplacements[index].coutTable
            const prixMetreCarres = props.emplacements[index].coutMetreCarre
            return (nbTables * prixTable + nbMetreCarres * prixMetreCarres).toFixed(2)
        } catch (err) {
            return 0
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
        console.log(inputsEspaces)
        // The data we need to send
        const data = {
            inputsEspaces,
            remiseReservation,
            prixReservation: ((allPrice() - remiseReservation).toFixed(2))
        }
        /*Axios.put('')
            .then()*/
    }

    const saveChanges = () => {
        console.log("OLD")
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
                                    onChange={(event) => handleChangeEmp(event, 'nombreTables' + index, index)}
                                />
                            </td>
                            <td className="align-middle">
                                <Input
                                    type="text"
                                    id={'metreCarres' + index}
                                    value={props.espaces.length === 0 ? inputsEspaces[index]["metreCarres" + index] : inputsEspaces[index].metreCarres}
                                    onChange={(event) => handleChangeEmp(event, 'metreCarres' + index, index)}
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
                        </Button>
                    </td>
                </tr>
                </tfoot>
            </Table>
        </Row>
    )
}

export default ReservationEmplacements;