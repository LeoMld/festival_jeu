import React, {useState, useEffect} from 'react'

import {
    Button,
    Collapse,
    Card,
    CardBody,
    Table,
    Modal,
    CardHeader,
    Alert,
    Col,
    Row,
    Input
} from 'reactstrap'

import token from "../../utils/token";
import Axios from "axios";
import Waiting from "../utils/Waiting";
import CreateUpdateZone from "./createUpdateZone";
import axios from "axios";

function Zone(props) {

    const [collapse, setCollapse] = useState(false)
    const [modalStateUpdate, setModalStateUpdate] = useState(false)
    const [modalStateDelete, setModalStateDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [errorDelete, setErrorDelete] = useState(null)
    const [zone, setZone] = useState(props.zone)

    useEffect(() => {
        setZone(props.zone)
    }, [props.zone])

    // Delete a zone on the server
    const deleteZone = () => {
        setErrorDelete(null)
        setIsDeleting(true)
        Axios.delete('/api/gestion/zone/' + zone.idZone, {
            data: {idFestival: zone.FK_idFestival},
            headers: {
                Authorization: token.getToken()
            }
        })
            .then(() => {
                // We update the view
                props.deleteZone(zone.idZone)
                setIsDeleting(false)
                setModalStateDelete(false)
            })
            .catch((err) => {
                setErrorDelete(err.message)
                setIsDeleting(false)
                if (err.response.data.code === 0) {
                    token.destroyToken()
                }
            })
    }

    // We update the prototype
    const handlePrototypeChange = async (event, val, idJeu) => {
        axios.put('/api/games/' + idJeu, {bool: val}, {headers: {Authorization: token.getToken()}})
            .then(() => {
                // We update the parent view
                props.updateGameZone(zone.idZone, idJeu, event.target.id, val)
            })
    }

    // Called when the user wants to change the zone of a reserved game
    const handleChangeZone = (idJeu, idReservation) => {
        const idNewZone = document.getElementById("zoneSelector" + idJeu).value
        const data = {
            idJeu,
            idReservation,
            idZone: zone.idZone,
            idNewZone,
            idFestival: zone.FK_idFestival
        }
        Axios.put('/api/gestion/jeuPresent/', data, {headers: {Authorization: token.getToken()}})
            .then(() => {
                //TODO view update
            })
    }

    return (
        <div>
            <div className="btn-wrapper  my-4">
                <Button block color="default" onClick={() => setCollapse(!collapse)}>Zone
                    - {zone.libelleZone} : {zone.games.length} jeux
                </Button>
                <CreateUpdateZone modalState={modalStateUpdate}
                                  setModalState={setModalStateUpdate}
                                  zone={zone}
                                  updateZone={props.updateZone}
                                  componentState={1}/>
            </div>
            <Collapse
                isOpen={collapse}
            >
                <Card>
                    {zone.libelleZone !== "Indéfinie" &&
                    <CardHeader>
                        <div className="btn-wrapper">
                            <Button
                                color="default"
                                type="button"
                                outline
                                onClick={() => setModalStateUpdate(true)}>
                                Modifier
                            </Button>
                            <Button outline color="danger" onClick={() => setModalStateDelete(true)}>
                                Supprimer
                            </Button>
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
                                        <h4 className="heading mt-4">Suppression : Zone - {zone.libelleZone}</h4>
                                        <p>
                                            Êtes-vous sûrs de vouloir supprimer cette zone ?
                                            Si elle contient des jeux, ces jeux retourneront dans la zone indéfinie.
                                        </p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    {errorDelete ? <Alert color="danger">{errorDelete}</Alert> :
                                        isDeleting ? <Waiting name="suppression"/> :
                                            <Button className="btn-white" color="default" type="button"
                                                    onClick={() => deleteZone()}>
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
                            </Modal>
                        </div>
                    </CardHeader>}
                    <CardBody>
                        <h2 className="text-left font-weight-bold">Jeux réservés</h2>
                        <Table className="table-light table-striped table-bordered table-active">
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Éditeur</th>
                                <th>Joueurs</th>
                                <th>Âge min</th>
                                <th>Durée</th>
                                <th>Type</th>
                                <th>Prototype</th>
                                <th colSpan={2}>Gestion</th>
                            </tr>
                            </thead>
                            <tbody>
                            {zone.games.length === 0 &&
                            <td colSpan={9}>
                                Cette zone ne comporte pas encore de jeux.
                            </td>
                            }
                            {zone.games.map((game, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="align-middle">{game.libelleJeu}</td>
                                        <td className="align-middle">{game.nomPersonne}</td>
                                        <td className="align-middle">{game.nombreJoueur}</td>
                                        <td className="align-middle">{game.ageMinimum}</td>
                                        <td className="align-middle">{game.duree}</td>
                                        <td className="align-middle">{game.libelleTypeJeu}</td>
                                        <td className="align-middle">
                                            <Col>
                                                <label className="custom-toggle">
                                                    <input id="prototype"
                                                           type="checkbox"
                                                           checked={game.prototype}
                                                           onChange={(event) => handlePrototypeChange(event, !game.prototype, game.PK_idJeu)}/>
                                                    <span className="custom-toggle-slider rounded-circle"/>
                                                </label>
                                            </Col>
                                        </td>
                                        <td className="align-middle">
                                            <Row>
                                                <Col>
                                                    <p className="mb-1">Placer</p>
                                                    <Input type="select"
                                                           name="select"
                                                           id={"zoneSelector" + game.PK_idJeu}
                                                           size="sm"
                                                           defaultValue={zone.libelleZone}>
                                                        {props.zones.map((z, index) => {
                                                                return (
                                                                    <option value={z.idZone}
                                                                            key={index}>{z.libelleZone}</option>
                                                                )
                                                            }
                                                        )}
                                                    </Input>
                                                    <Button block
                                                            size="sm mb-2"
                                                            onClick={() => handleChangeZone(game.PK_idJeu, game.PK_idReservation)}>
                                                        Valider
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row className="justify-content-center">
                                                <Row>
                                                    <Col className="mr-3">
                                                        <p>Reçu</p>
                                                        <i style={{"font-size": "3rem"}}
                                                           className={game.estRecu ? "ni ni-check-bold text-green" : "ni ni-fat-remove text-red"}/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p>Bénévoles</p>
                                                        <i style={{"font-size": "3rem"}}
                                                           className={game.besoinAnimateurReservation ? "ni ni-check-bold text-green" : "ni ni-fat-remove text-red"}/>
                                                    </Col>
                                                </Row>
                                            </Row>
                                        </td>
                                    </tr>)
                            })}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Collapse>
        </div>
    )
}

export default Zone;