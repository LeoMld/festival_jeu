import React, {useState, useEffect} from 'react'

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
    const [isChanging, setIsChanging] = useState(false)

    // TODO error
    // TODO update festival

    const [modalState, setModalState] = useState(false)

    // Change the current festival to the one given in parameter
    const changeCurrentFestival = (idFestival) => {
        setIsChanging(true)
        Axios.put('/api/gestion/changeCurrentfestival/' + idFestival)
            .then(res => {
                // We update the festivals here
                changeViewCurrentFestival(idFestival)
                setIsChanging(false)
            })
    }

    const changeViewCurrentFestival = (idFestival) => {
        const updateFestivals = [...festivals];
        updateFestivals.forEach(f => {
            if (f.idFestival === idFestival) {
                f.currentFestival = true
            } else {
                f.currentFestival = false
            }
        })
        setFestivals(updateFestivals)
    }

    // We add the new festival on the view
    const addNewFestival = async (newFestival) => {
        // We make it current one
        changeViewCurrentFestival(newFestival.idFestival)
        // We update all the festivals
        setFestivals([newFestival, ...festivals])
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
                <CreateUpdateFestival modalState={modalState}
                                      setModalState={setModalState}
                                      componentState={0}
                                      addNewFestival={addNewFestival}/>
            </Row>
            {festivals ? festivals.map((festival, index) => {
                return (
                    <Row className="mb-5" key={index}>
                        <Col>
                            <Festival festival={festival}
                                      changeCurrentFestival={changeCurrentFestival}
                                      isChanging={isChanging}/>
                        </Col>
                    </Row>
                )
            }) : <Waiting name="festivals"/>}
        </div>
    )
}

export default FestivalChoice
