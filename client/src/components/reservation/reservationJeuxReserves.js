import React, {useState} from "react";
import {Alert, Button, Col, Input, Modal, Row, Table} from "reactstrap";
import token from "../../utils/token";
import axios from "axios";
import Axios from "axios";
import Waiting from "../utils/Waiting";
import CreateUpdateZone from "../zone/createUpdateZone";
import CreateNewJeuPresent from "./createNewJeuPresent"

function ReservationJeuxReserves(props) {

    // Init the state
    const initPrixRenvoi = () => {
        const nbJeux = props.info.jeuPresents.length
        const init = []
        for (let i = 0; i < nbJeux; i++) {
            init[i] = {
                PK_idJeu: props.info.jeuPresents[i].PK_idJeu,
                prixRenvoi: props.info.jeuPresents[i].prixRenvoi
            }
        }
        return init
    }

    const [prixRenvoi, setPrixRenvoi] = useState(initPrixRenvoi())
    const [isPendingPR, setIsPendingPR] = useState(false)
    const [errorPR, setErrorPR] = useState(null)

    const [modalStateZone, setModalStateZone] = useState(false)
    const [modalStateJeuPresent, setModalStateJeuPresent] = useState(false)
    const [modalStateDelete, setModalStateDelete] = useState(false)

    const [gameToDelete, setGameToDelete] = useState()
    const [errorDelete, setErrorDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // We update the prototype
    const handlePrototypeChange = async (val, idJeu) => {
        axios.put('/api/games/' + idJeu, {bool: val}, {headers: {Authorization: token.getToken()}})
            .then(() => {
                // We update the parent view
                props.updateGameReservation(val, idJeu)
            })
            .catch((err) => {
                if (err.response.data.code === 0) {
                    token.destroyToken()
                }
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
            .catch((err) => {
                if (err.response.data.code === 0) {
                    token.destroyToken()
                }
            })
    }

    // Handle the changes on the inputs
    const handleChangePrixRenvoi = (event, index) => {
        const newPrices = [...prixRenvoi]
        newPrices[index].prixRenvoi = event.target.value
        setPrixRenvoi(newPrices)
    }

    // We remove the reserve game
    const deleteGameReserved = () => {
        setIsDeleting(true)
        const data = {
            idJeu: gameToDelete.PK_idJeu,
            idZone: gameToDelete.PK_idZone,
            idReservation: gameToDelete.PK_idReservation
        }
        Axios.delete('/api/gestion/jeuPresent', {
            data,
            headers: {Authorization: token.getToken()}
        })
            .then(() => {
                setIsDeleting(false)
                // We update the view by removing the game
                props.deleteGameReservation(gameToDelete)
                let newPrixRenvoi = [...prixRenvoi]
                newPrixRenvoi = newPrixRenvoi.filter(pr => pr.PK_idJeu !== gameToDelete.PK_idJeu)
                setPrixRenvoi(newPrixRenvoi)
                setModalStateDelete(false)
            })
            .catch((err) => {
                setIsDeleting(false)
                setErrorDelete(err.message)
            })
    }

    // We change the price of a game
    const changePrixRenvoi = (idJeu, idZone, index) => {
        setIsPendingPR(index)
        const data = {
            idReservation: props.info.idReservation,
            idZone: idZone,
            prixRenvoi: prixRenvoi[index].prixRenvoi
        }
        Axios.put('/api/gestion/jeuPresent/' + idJeu, data, {headers: {Authorization: token.getToken()}})
            .then(() => {
                // It's done
                setIsPendingPR(false)
            })
            .catch((err) => {
                setIsPendingPR(false)
                setErrorPR(err.message)
                if (err.response.data.code === 0) {
                    token.destroyToken()
                }
            })
    }

    // Add a new zone into the festival
    const addNewZone = (newZone) => {
        props.addNewZoneGameReservation("zones", newZone)
    }

    // Add a new game in the reservation view
    const addNewGameReservation = (newGameReserved) => {
        const newPrixRenvoi = [...prixRenvoi]
        newPrixRenvoi.push({
            PK_idJeu: newGameReserved.PK_idJeu,
            prixRenvoi: newGameReserved.prixRenvoi
        })
        setPrixRenvoi(newPrixRenvoi)
        props.addNewZoneGameReservation("jeuPresents", newGameReserved)
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
                                {isPendingPR === index ? <Waiting/> :
                                    errorPR ? <Alert color="danger">{errorPR}</Alert> :
                                        <Button block
                                                size="sm"
                                                disabled={isNaN(prixRenvoi[index].prixRenvoi)}
                                                onClick={() => changePrixRenvoi(game.PK_idJeu, game.PK_idZone, index)}>
                                            Valider
                                        </Button>}
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
                                        onClick={() => {
                                            setGameToDelete(game)
                                            setModalStateDelete(true)
                                        }}>
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
                            onClick={() => setModalStateJeuPresent(true)}
                        >
                            Ajouter un jeu à la réservation
                        </Button>
                        <Button
                            color="success"
                            outline
                            type="button"
                            onClick={() => setModalStateZone(true)}
                        >
                            Ajouter une zone au festival
                        </Button>

                    </td>
                </tr>
                </tfoot>
            </Table>
            <CreateNewJeuPresent modalState={modalStateJeuPresent}
                                 setModalState={setModalStateJeuPresent}
                                 info={props.info}
                                 addNewGameReservation={addNewGameReservation}/>
            <CreateUpdateZone modalState={modalStateZone}
                              setModalState={setModalStateZone}
                              addNewZone={addNewZone}
                              componentState={0}/>
            {gameToDelete &&
            <Modal
                className="modal-dialog-centered modal-danger"
                contentClassName="bg-gradient-danger"
                isOpen={modalStateDelete}
                toggle={() => setModalStateDelete(!modalStateDelete)}
            >
                <div className="modal-header">
                    <h6 className="modal-title" id="modal-title-notification">
                        Confirmation de suppression
                    </h6>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setModalStateDelete(!modalStateDelete)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="py-3 text-center">
                        <i className="ni ni-bell-55 ni-3x"/>
                        <h4 className="heading mt-4">Suppression : {gameToDelete.libelleJeu}</h4>
                        <p>
                            Êtes-vous sûr de vouloir supprimer ce jeu de la réservation ?
                        </p>
                    </div>
                </div>
                <div className="modal-footer">
                    {errorDelete ? <Alert color="danger">{errorDelete}</Alert> :
                        isDeleting ? <Waiting name="suppression"/> :
                            <Button className="btn-white" color="default" type="button"
                                    onClick={() => deleteGameReserved()}>
                                Confirmer
                            </Button>}
                    <Button
                        className="text-white ml-auto"
                        color="link"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setModalStateDelete(!modalStateDelete)}
                    >
                        Annuler
                    </Button>
                </div>
            </Modal>}
        </Row>
    )
}

export default ReservationJeuxReserves;