import React, {useState} from 'react'
import useAxios from "../utils/useAxios";
import token from "../utils/token";

import {Alert, Button, Col, ListGroup, ListGroupItem, Row, UncontrolledAlert} from "reactstrap";

import Waiting from "../components/utils/Waiting";
import Zone from "../components/zone/zone";
import CreateUpdateZone from "../components/zone/createUpdateZone"

function Zones() {

    // We get all the zones of the festival
    const {data: zones, setData: setZones, isPending, error} = useAxios('/api/gestion/zone')
    const [modalState, setModalState] = useState(false)

    // We add the zone created in the view
    const addNewZone = (newZone) => {
        const newZones = [...zones]
        newZones.push(newZone)
        setZones(newZones)
    }

    // We update the zone in the view
    const updateZone = (idZone, libelleZone) => {
        const updateZones = [...zones];
        updateZones.forEach(zone => {
            if (zone.idZone === idZone) {
                zone.libelleZone = libelleZone
            }
        })
        setZones(zones)
    }

    // We remove the zone from the view that has been deleted
    const deleteZone = (idZone) => {
        // We retrieve the games in the deleted zone
        const games = (zones.filter(z => z.idZone === parseInt(idZone)))[0].games
        // We remove the zone
        const newZones = zones.filter(item => item.idZone !== parseInt(idZone))
        // We add the games
        newZones[0].games = [...newZones[0].games, ...games]
        setZones(newZones)
    }

    const changeZoneJeu = (idJeu, idZone, idReservation, idNewZone) => {
        let newZones = [...zones]
        // We retrieve the changed zone
        const changedZone = zones.filter(z => z.idZone === parseInt(idZone))[0]
        const indexOfZone = zones.indexOf(changedZone)
        // We retrieve the game
        const changedGame = changedZone.games.filter(g => g.PK_idJeu === idJeu && g.PK_idReservation === idReservation)[0]
        const indexOfGame = changedZone.games.indexOf(changedGame)
        // We remove the game from the zone
        newZones[indexOfZone].games.splice(indexOfGame, 1)
        // Now we need to add it into the new zone
        const newZone = zones.filter(z => z.idZone === parseInt(idNewZone))[0]
        let indexOfNewZone = zones.indexOf(newZone)
        newZones[indexOfNewZone].games.push(changedGame)
        setZones(newZones)
    }

    // Change the prototype on the view
    const updateGameZone = (idZone, idJeu, colName, val, idReservation) => {
        let newZones = [...zones]
        let changedGame = zones.filter(z => z.idZone === idZone)[0]
        let indexOfZone = zones.indexOf(changedGame)
        let indexOfGame = changedGame.games.indexOf(changedGame.games.filter(g => g.PK_idJeu === idJeu && g.PK_idReservation === idReservation)[0])
        newZones[indexOfZone].games[indexOfGame][colName] = val
        setZones(newZones)
    }

    return (
        <div className="justify-content-center mr-7 ml-7">
            <h1 className="font-weight-900 mt-5 mb-5">Liste des zones et de leurs jeux</h1>
            <h2 className="text-left font-weight-300">Navigation rapide</h2>
            {zones && (zones.length === 0 || (token.getType() === 2 && zones.length === 1)) &&
            <p>Il n'y a rien ?? afficher pour le moment.</p>}
            <Row>
                <Col>
                    <ListGroup>
                        {!isPending && !error &&
                        zones.map((zone, index) => {
                            if (index % 3 === (token.getType() !== 2 ? 0 : 1)) return (
                                <ListGroupItem key={"nav" + index} tag="a" href={"#" + index}>
                                    {zone.libelleZone +" : "+zone.games.length +(zone.games.length > 1 ? " jeux" : " jeu")}
                                </ListGroupItem>
                            )
                        })}
                    </ListGroup>
                </Col>
                <Col>
                    {!isPending && !error &&
                    zones.map((zone, index) => {
                        if (index % 3 === (token.getType() !== 2 ? 1 : 2)) return (
                            <ListGroupItem key={"nav" + index} tag="a" href={"#" + index.toString()}>
                                {zone.libelleZone +" : "+zone.games.length +(zone.games.length > 1 ? " jeux" : " jeu")}
                            </ListGroupItem>
                        )
                    })}
                </Col>
                <Col>
                    {!isPending && !error &&
                    zones.map((zone, index) => {
                        if (index % 3 === (token.getType() !== 2 ? 2 : (zone.libelleZone === "Ind??finie" ? -1 : 0))) return (
                            <ListGroupItem key={"nav" + index} tag="a" href={"#" + index.toString()}>
                                {zone.libelleZone +" : "+zone.games.length +(zone.games.length > 1 ? " jeux" : " jeu")}
                            </ListGroupItem>
                        )
                    })}
                </Col>
            </Row>
            {token.getType() === 1 &&
            <div className="d-flex flex-row-reverse mb-sm-3 mt-4">
                <Button
                    color="success"
                    outline
                    type="button"
                    onClick={() => setModalState(true)}
                >
                    Nouvelle Zone
                </Button>
                <CreateUpdateZone modalState={modalState}
                                  setModalState={setModalState}
                                  addNewZone={addNewZone}
                                  componentState={0}/>
            </div>}
            {token.getType() === 1 &&
            zones && zones.filter(zone => (zone.libelleZone === "Ind??finie") && (zone.games.length > 0)).length > 0 &&
            <UncontrolledAlert color="primary">
                Il vous reste encore des jeux ?? placer !
            </UncontrolledAlert>}
            {error ?
                <Alert color="danger">
                    {error}
                </Alert> :
                (!isPending ? (zones.map((zone, index) => {
                        if (token.getType() !== 2 || (token.getType() === 2 && zone.libelleZone !== "Ind??finie"))
                            return (
                                <Row className="mb-3 mt-3" key={index} id={index}>
                                    <Col>
                                        <Zone zones={zones} zone={zone} updateZone={updateZone} deleteZone={deleteZone}
                                              updateGameZone={updateGameZone} changeZoneJeu={changeZoneJeu}/>
                                    </Col>
                                </Row>
                            )
                    })) :
                    <Waiting name="zones"/>)
            }
        </div>
    )
}

export default Zones;
