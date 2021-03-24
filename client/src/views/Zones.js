import React, {useState} from 'react'
import useAxios from "../utils/useAxios";
import {
    Alert,
    UncontrolledAlert,
    Row,
    Button,
    Col
} from "reactstrap";

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
        //TODO
        /*
        // We retrieve the games in the deleted zone
        const games = (zones.filter(item => item.idZone === idZone)).games
        // We remove the zone
        const newZones = zones.filter(item => item.idZone !== idZone)
        // We add the games
        newZones[0].games = [...newZones[0].games, games]
        setZones(newZones)
         */
    }

    // Change the prototype on the view
    const updateGameZone = (idZone, idJeu, colName, val) => {
        let newZones = [...zones]
        let changedGame = zones.filter(z => z.idZone === idZone)[0]
        let indexOfZone = zones.indexOf(changedGame)
        let indexOfGame = changedGame.games.indexOf(changedGame.games.filter(g => g.PK_idJeu === idJeu)[0])
        newZones[indexOfZone].games[indexOfGame][colName] = val
        setZones(newZones)
    }

    return (
        <div className="container justify-content-center">
            <h1 className="font-weight-900 mt-5 mb-5">Liste des zones</h1>
            <div className="d-flex flex-row-reverse mb-sm-3">
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
            </div>
            {zones && zones.filter(zone => (zone.libelleZone === "Indéfinie") && (zone.games.length > 0)).length > 0 &&
            <UncontrolledAlert color="primary">
                Il vous reste encore des jeux à placer !
            </UncontrolledAlert>}
            {error ?
                <Alert color="danger">
                    {error}
                </Alert> :
                (!isPending ? (zones.map((zone, index) => {
                        return (
                            <Row className="mb-3 mt-3" key={index}>
                                <Col>
                                    <Zone zones={zones} zone={zone} updateZone={updateZone} deleteZone={deleteZone}
                                          updateGameZone={updateGameZone}/>
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
