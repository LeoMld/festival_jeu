import React, {useState} from 'react'

import Festival from "../components/festival/festival";
import {
    Button,
    Col,
    Row,
    Alert
} from "reactstrap";

import useAxios from "../utils/useAxios";
import Axios from "axios";
import Waiting from "../components/utils/Waiting";
import CreateUpdateFestival from "../components/festival/createUpdateFestival";

function FestivalChoice() {

    // We get all the festivals
    const {data: festivals, setData: setFestivals, isPending, error} = useAxios('/api/gestion/festival');
    // We get the festival to see of the user
    const {
        data: festivalToSee,
        setData: setFestivalToSee,
        isPending: isPendingFTS,
        error: errorFTS
    } = useAxios('/api/festival')
    // Change the current state of a festival
    const [isChanging, setIsChanging] = useState(false)
    const [errorChanging, setErrorChanging] = useState(null)
    const [modalState, setModalState] = useState(false)

    // Change the current festival to the one given in parameter
    const changeCurrentFestival = (idFestival) => {
        setIsChanging(true)
        Axios.put('/api/gestion/festival/' + idFestival)
            .then(() => {
                // We update the festivals here
                changeViewCurrentFestival(idFestival)
                setErrorChanging(null)
                setIsChanging(false)
            })
            .catch(err => {
                setErrorChanging({
                    message: err.message,
                    idFestival
                })
                setIsChanging(false)
            })
    }

    const changeViewCurrentFestival = (idFestival) => {
        const updateFestivals = [...festivals];
        updateFestivals.forEach(f => {
            f.currentFestival = (f.idFestival === idFestival);
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

    // Update the name of the festival on the view
    const updateFestival = (idFestival, nameFestival) => {
        const updateFestivals = [...festivals];
        updateFestivals.forEach(f => {
            if (f.idFestival === idFestival) {
                f.nameFestival = nameFestival
            }
        })
        setFestivals(updateFestivals)
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
            {(error === null && errorFTS === null) ?
                (!isPending ? festivals.map((festival, index) => {
                    return (
                        <Row className="mb-5" key={index}>
                            {(!isPendingFTS) &&
                            (<Col>
                                <Festival festival={festival}
                                          changeCurrentFestival={changeCurrentFestival}
                                          isChanging={isChanging}
                                          errorChanging={errorChanging}
                                          updateFestival={updateFestival}
                                          festivalToSee={festivalToSee}
                                          setFestivalToSee={setFestivalToSee}/>
                            </Col>)}
                        </Row>)
                }) : <Waiting name="festivals"/>)
                : <Alert color="danger">
                    {error && error}
                    {errorFTS && errorFTS}
                </Alert>}
        </div>
    )
}

export default FestivalChoice;
