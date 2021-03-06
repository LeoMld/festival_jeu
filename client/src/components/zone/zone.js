import React, {useEffect, useState} from 'react'

import {
    Alert,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    Input,
    Modal,
    Row,
    Table
} from 'reactstrap'

import token from "../../utils/token";
import Axios from "axios";
import axios from "axios";
import CreateUpdateZone from "./createUpdateZone";
import Waiting from "../utils/Waiting"
import {Link} from "react-router-dom";
import Pagination from "react-js-pagination";

function Zone(props) {

    const [collapse, setCollapse] = useState(false)
    const [modalStateUpdate, setModalStateUpdate] = useState(false)
    const [modalStateDelete, setModalStateDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [errorDelete, setErrorDelete] = useState(null)
    const [zone, setZone] = useState(props.zone)

    const [nbPagin, setNbPagin] = useState(1)
    const [gamesToDisplay, setGamesToDisplay] = useState([])

    useEffect(()=>{
        if(zone){
            const indexDebut = (nbPagin-1)*5
            const indexFin = (zone.games.length <= nbPagin*5-1) ? zone.games.length: nbPagin*5
            let gamesPage = []
            for(let i = indexDebut; i<indexFin; i++){
                gamesPage.push(zone.games[i])
            }
            setGamesToDisplay(gamesPage)
        }
    },[nbPagin, props.zones])

    useEffect(() => {
        setZone(props.zone)
    }, [props.zones])

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
    const handlePrototypeChange = async (event, val, idJeu, idReservation) => {
        axios.put('/api/games/' + idJeu, {bool: val}, {headers: {Authorization: token.getToken()}})
            .then(() => {
                // We update the parent view
                props.updateGameZone(zone.idZone, idJeu, event.target.id, val, idReservation)
            })
    }

    // Called when the user wants to change the zone of a reserved game
    const handleChangeZone = (idJeu, idReservation, idZone) => {
        const idNewZone = document.getElementById("zoneSelector" + idJeu + idZone + idReservation).value
        const data = {
            idJeu,
            idReservation,
            idZone: zone.idZone,
            idNewZone,
            idFestival: zone.FK_idFestival
        }
        Axios.put('/api/gestion/jeuPresent/', data, {headers: {Authorization: token.getToken()}})
            .then(() => {
                // It's fine, we update the view
                if(nbPagin !== 1 && gamesToDisplay.length === 1 && idZone !== idNewZone){
                    setNbPagin(nbPagin - 1)
                }
                props.changeZoneJeu(idJeu, zone.idZone, idReservation, idNewZone)
            })
    }

    return (
        <div>
            <div className="btn-wrapper  my-4">
                <Button block color="default" onClick={() => setCollapse(!collapse)}>Zone
                    - {zone.libelleZone} : {zone.games.length} {zone.games.length > 1 ? "jeux" : "jeu"}
                </Button>
                {token.getType() !== 2 &&
                <CreateUpdateZone modalState={modalStateUpdate}
                                  setModalState={setModalStateUpdate}
                                  zone={zone}
                                  updateZone={props.updateZone}
                                  componentState={1}/>}
            </div>
            <Collapse
                isOpen={collapse}
            >
                <Card>
                    {zone.libelleZone !== "Ind??finie" && token.getType() === 1 &&
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
                                        <span aria-hidden={true}>??</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="py-3 text-center">
                                        <i className="ni ni-bell-55 ni-3x"/>
                                        <h4 className="heading mt-4">Suppression : Zone - {zone.libelleZone}</h4>
                                        <p>
                                            ??tes-vous s??r de vouloir supprimer cette zone ?
                                            Si elle contient des jeux, ces jeux retourneront dans la zone ind??finie.
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
                        <h2 className="text-left font-weight-bold">Jeux {token.getType() !== 2 ? "r??serv??s" : "expos??s"}</h2>
                        <Table className="table-light table-striped table-bordered table-active">
                            <thead>
                            <tr>
                                <th>Nom</th>
                                <th>??diteur</th>
                                <th>Joueurs</th>
                                <th>??ge min</th>
                                <th>Dur??e</th>
                                <th>Type</th>
                                <th>Prototype</th>
                                {token.getType() !== 2 &&
                                <>
                                    <th colSpan={2}>D??tails</th>
                                    {token.getType() === 1 &&
                                    <th>Gestion</th>}
                                    <th>R??servation</th>
                                </>
                                }
                            </tr>
                            </thead>
                            <tbody>
                            {zone.games.length === 0 &&
                            <tr>
                                <td colSpan={token.getType() !== 2 ? 11 : 8}>
                                    Cette zone ne comporte pas encore de jeu.
                                </td>
                            </tr>
                            }
                            {zone.games && gamesToDisplay.map((game, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="align-middle">{game.libelleJeu}</td>
                                        <td className="align-middle">{game.nomPersonne}</td>
                                        <td className="align-middle">{game.nombreJoueur}</td>
                                        <td className="align-middle">{game.ageMinimum}</td>
                                        <td className="align-middle">{game.duree}</td>
                                        <td className="align-middle">{game.libelleTypeJeu}</td>
                                        {token.getType() !== 2 ?
                                            <td className="align-middle">
                                                <Col>
                                                    <label className="custom-toggle">
                                                        <input id="prototype"
                                                               type="checkbox"
                                                               disabled={token.getType() !== 1}
                                                               checked={game.prototype}
                                                               onChange={(event) => handlePrototypeChange(event, !game.prototype, game.PK_idJeu, game.PK_idReservation)}/>
                                                        <span className="custom-toggle-slider rounded-circle"/>
                                                    </label>
                                                </Col>
                                            </td> :
                                            <i style={{fontSize: "3rem"}}
                                               className={game.prototype ? "ni ni-check-bold text-green" : "ni ni-fat-remove text-red"}/>}
                                        {token.getType() !== 2 &&
                                        <>
                                            <td className="align-middle">
                                                <p>Re??u</p>
                                                <i style={{fontSize: "3rem"}}
                                                   className={game.jeuxRecuReservation ? "ni ni-check-bold text-green" : "ni ni-fat-remove text-red"}/>
                                            </td>
                                            <td>
                                                <p>B??n??voles</p>
                                                <i style={{fontSize: "3rem"}}
                                                   className={game.besoinAnimateurReservation ? "ni ni-check-bold text-green" : "ni ni-fat-remove text-red"}/>
                                            </td>
                                            {token.getType() === 1 &&
                                            <td className="align-middle">
                                                <Row>
                                                    <Col>
                                                        <p className="mb-1">Placer</p>
                                                        <Input type="select"
                                                               name="select"
                                                               id={"zoneSelector" + game.PK_idJeu + game.PK_idZone + game.PK_idReservation}
                                                               bsSize="sm"
                                                               defaultValue={zone.idZone}>
                                                            {props.zones.map((z, index2) => {
                                                                    return (
                                                                        <option value={z.idZone}
                                                                                key={index2}>{z.libelleZone}</option>
                                                                    )
                                                                }
                                                            )}
                                                        </Input>
                                                        <Button block
                                                                size="sm mb-2"
                                                                onClick={() => handleChangeZone(game.PK_idJeu, game.PK_idReservation, game.PK_idZone)}>
                                                            Valider
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </td>}
                                            <td className="align-middle">
                                                <Link style={{fontSize: "2.5rem"}}
                                                      to={'/reservations/' + game.PK_idReservation}>
                                                    <i className="ni ni-book-bookmark"/>
                                                </Link>
                                            </td>
                                        </>}
                                    </tr>)
                            })}
                            </tbody>
                        </Table>
                    </CardBody>
                <CardFooter>
                    {zone.games && nbPagin &&
                    <Row className="justify-content-center mt-md">
                        <Pagination
                            itemClass="page-item"
                            linkClass="page-link"
                            activePage={nbPagin}
                            itemsCountPerPage={5}
                            totalItemsCount={zone.games.length}
                            pageRangeDisplayed={5}
                            onChange={(pageNumber)=>{setNbPagin(pageNumber)}}
                            getPageUrl={(nb) => {
                                return nb.toString()
                            }}
                        />
                    </Row>
                    }
                </CardFooter>
                </Card>
            </Collapse>
        </div>
    )
}

export default Zone;
