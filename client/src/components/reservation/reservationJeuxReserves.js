import React, {useState} from "react";
import {Button, Col, Input, Row, Table} from "reactstrap";
import token from "../../utils/token";
import axios from "axios";
import Axios from "axios";

function ReservationJeuxReserves(props) {

    // Init the state
    const initPrixRenvoi = () => {
        const nbJeux = props.info.jeuPresents.length
        const init = [nbJeux]
        for (let i = 0; i < nbJeux; i++) {
            init[i] = {
                PK_idJeu: props.info.jeuPresents[i].PK_idJeu,
                prixRenvoi: props.info.jeuPresents[i].prixRenvoi
            }
        }
        return init
    }

    const [prixRenvoi, setPrixRenvoi] = useState(initPrixRenvoi())

    // We update the prototype
    const handlePrototypeChange = async (val, idJeu) => {
        axios.put('/api/games/' + idJeu, {bool: val}, {headers: {Authorization: token.getToken()}})
            .then(() => {
                // We update the parent view
                props.updateGameReservation(val, idJeu)
            })
    }

    // Called when the user wants to change the zone of a reserved game
    const handleChangeZone = (idJeu, idZone) => {
        const idNewZone = document.getElementById("zoneSelector" + idJeu).value
        const data = {
            idJeu,
            idReservation: props.info.idReservation,
            idZone,
            idNewZone,
            idFestival: props.info.FK_idFestival
        }
        Axios.put('/api/gestion/jeuPresent/', data, {headers: {Authorization: token.getToken()}})
            .then(() => {
                // It's fine, we update the view
                props.changeZoneJeu(idJeu, idNewZone)
            })
    }

    // Handle the changes on the inputs
    const handleChangePrixRenvoi = (event, index) => {
        const newPrices = [...prixRenvoi]
        newPrices[index].prixRenvoi = event.target.value
        setPrixRenvoi(newPrices)
    }

    // We remove the reserve game
    const deleteGameReserved = (idJeu) => {
        //TODO
        console.log("REMOVE")
    }

    // We add a new game to the reservation
    const addReservedGame = () => {
        //TODO
        console.log("ADD")
    }

    // We change the price of a game
    const changePrixRenvoi = () => {
        //TODO
        console.log("UPDATE")
    }

    // Add a new zone into the festival
    const addNewZone = () => {
        // TODO
        console.log("ADD ZONE")
    }

    // Return the libelle of the zone with the id
    const displayLibelleZone = (idZone) => {
        const zone = props.info.zones.filter(z => z.idZone === parseInt(idZone))[0]
        return zone.libelleZone
    }

    return (
        <Row className="mt-2">
            <h3 className="font-weight-600 mb-3">Jeux de la réservation</h3>
            <Table className="table-light table-striped table-bordered table-active">
                <thead>
                <tr>
                    <th className="align-middle">Nom</th>
                    <th className="align-middle">Éditeur</th>
                    <th className="align-middle">Type</th>
                    <th className="align-middle">Prototype</th>
                    <th className="align-middle">Prix renvoi</th>
                    <th colSpan={2} className="align-middle">Zone</th>
                    <th className="align-middle">Suppression</th>
                </tr>
                </thead>
                <tbody>
                {props.info.jeuPresents.map((game, index) => {
                    return (
                        <tr key={index}>
                            <td className="align-middle">{game.libelleJeu}</td>
                            <td className="align-middle">{game.nomPersonne}</td>
                            <td className="align-middle">{game.libelleTypeJeu}</td>
                            <td className="align-middle">
                                <label className="custom-toggle">
                                    <input id="prototype"
                                           type="checkbox"
                                           checked={game.prototype}
                                           onChange={(event) => handlePrototypeChange(!game.prototype, game.PK_idJeu)}/>
                                    <span className="custom-toggle-slider rounded-circle"/>
                                </label>
                            </td>
                            <td className="align-middle">
                                <Input
                                    type="text"
                                    value={prixRenvoi[index].prixRenvoi}
                                    onChange={(event) => handleChangePrixRenvoi(event, index)}
                                />
                                <Button block
                                        size="sm"
                                        disabled={isNaN(prixRenvoi[index].prixRenvoi)}
                                        onClick={() => changePrixRenvoi(index)}>
                                    Valider
                                </Button>
                            </td>
                            <td className="align-middle">
                                <Row>
                                    <Col>
                                        {displayLibelleZone(game.PK_idZone)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <i style={{fontSize: "3rem"}}
                                           className={displayLibelleZone(game.PK_idZone) !== "Indéfinie" ? "ni ni-check-bold text-green" : "ni ni-fat-remove text-red"}/>
                                    </Col>
                                </Row>
                            </td>
                            <td className="align-middle">
                                <Row>
                                    <Col>
                                        <p className="mb-1">Changer</p>
                                        <Input type="select"
                                               name="select"
                                               id={"zoneSelector" + game.PK_idJeu}
                                               defaultValue={displayLibelleZone(game.PK_idZone)}>
                                            size="sm">
                                            {props.info.zones.map((z, index) => {
                                                    return (
                                                        <option value={z.idZone}
                                                                key={index}>{z.libelleZone}</option>
                                                    )
                                                }
                                            )}
                                        </Input>
                                        <Button block
                                                size="sm mb-2"
                                                onClick={() => handleChangeZone(game.PK_idJeu, game.PK_idZone)}>
                                            Valider
                                        </Button>
                                    </Col>
                                </Row>
                            </td>
                            <td className="align-middle">
                                <Button outline
                                        color="danger"
                                        onClick={() => deleteGameReserved(game.PK_idJeu)}>
                                    Supprimer
                                </Button>
                            </td>
                        </tr>
                    )
                })}
                {props.info.jeuPresents.length === 0 &&
                <tr>
                    <td colSpan={8}> Cette réservation ne comprend pas encore de jeu.</td>
                </tr>
                }
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={8}>
                        <Button
                            color="success"
                            outline
                            type="button"
                            onClick={() => addReservedGame()}
                        >
                            Ajouter un jeu à la réservation
                        </Button>
                        <Button
                            color="success"
                            outline
                            type="button"
                            onClick={() => addNewZone()}
                        >
                            Ajouter une zone au festival
                        </Button>
                    </td>
                </tr>
                </tfoot>
            </Table>
        </Row>
    )
}

export default ReservationJeuxReserves;