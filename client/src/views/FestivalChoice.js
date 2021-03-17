import React, {useState} from 'react'

import Festival from "../components/festival/festival";
import {
    Button,
    Col,
    Row
} from "reactstrap";

import useAxios from "../utils/useAxios";
import Axios from "axios";

function FestivalChoice() {

    const {data: festivals, setData: setFestivals, pending, error} = useAxios('/api/gestion/AllFestivals');

    // TODO pending + error
    // TODO add or update festival

    const [modalUpdate, setModalUpdate] = useState(false)

    const changeCurrentFestival = (idFestival) => {
        // Change the current festival to the one given in parameter
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
                        onClick={() => setModalUpdate(!modalUpdate)}
                    >
                        Nouveau Festival
                    </Button>
                </Col>
            </Row>
            {festivals && festivals.map((festival, index) => {
                return (
                    <Row className="mb-5">
                        <Col>
                            <Festival festival={festival} changeCurrentFestival={changeCurrentFestival}/>
                        </Col>
                    </Row>
                )
            })}
        </div>
    )
}

export default FestivalChoice