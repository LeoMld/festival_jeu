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

    // We put 2 zones per row
    const displayZones = () => {
        const items = []
        for (let i = 1; i <= zones.length; i += 2) {
            items.push(<Row className="mb-3 mt-3 mr-1 ml-1" key={i}>
                <Col>
                    <Zone zone={zones[i - 1]} updateZone={updateZone} deleteZone={deleteZone}/>
                </Col>
                <Col>
                    {i < zones.length && <Zone zone={zones[i]} updateZone={updateZone} deleteZone={deleteZone}/>}
                </Col>
            </Row>)
        }
        return (
            <>
                {items}
            </>
        )
    }

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
        const newZones = zones.filter(item => item.idZone !== idZone)
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
                (!isPending ? (displayZones()) :
                    <Waiting name="zones"/>)
            }
        </div>
    )
}

export default Zones;
