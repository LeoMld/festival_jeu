import React, {useState} from 'react'

import Festival from "../components/festival/festival";
import {
    Button,
    Col,
    Row
} from "reactstrap";

import useAxios from "../utils/useAxios";
import Axios from "axios";
import Waiting from "../components/utils/Waiting";
import CreateUpdateFestival from "../components/festival/createUpdateFestival";

function FestivalChoice() {

    const {data: festivals, setData: setFestivals, pending, error} = useAxios('/api/gestion/AllFestivals');

    // TODO error
    // TODO add or update festival

    const [modalState, setModalState] = useState(false)

    // Change the current festival to the one given in parameter
    const changeCurrentFestival = (idFestival) => {
        Axios.put('/api/gestion/changeCurrentfestival/' + idFestival)
            .then(res => {
                // We update the festivals here
                const updateFestivals = [...festivals];
                updateFestivals.forEach(f => {
                    if (f.idFestival === idFestival) {
                        f.currentFestival = true
                    } else {
                        f.currentFestival = false
                    }
                })
                setFestivals(updateFestivals)
            })
    }

    return (
        <div className="container justify-content-center">
            <Row className="mb-5 mt-5">
                <Col>
                    <h1 className="font-weight-900">Liste des festivals</h1>
                </Col>
                <Col>
                    <Button
                        color="success"
                        type="button"
                        onClick={() => setModalState(!modalState)}
                    >
                        Nouveau Festival
                    </Button>
                </Col>
                <CreateUpdateFestival modalState = {modalState} setModalState = {setModalState} componentState={0}/>
            </Row>
            {festivals ? festivals.map((festival, index) => {
                return (
                    <Row className="mb-5">
                        <Col>
                            <Festival festival={festival} changeCurrentFestival={changeCurrentFestival}/>
                        </Col>
                    </Row>
                )
            }) : <Waiting name = "Festivals"/>}
        </div>
    )
}

export default FestivalChoice
