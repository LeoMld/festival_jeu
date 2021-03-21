import React, {useState, useEffect} from 'react'
import Axios from 'axios'

import {
    Button,
    Modal,
    Card,
    CardHeader,
    Form,
    FormGroup,
    InputGroup,
    Input,
    CardBody,
    Col,
    Row, Alert
} from 'reactstrap';
import Waiting from "../utils/Waiting";
import token from "../../utils/token";

function CreateUpdateFestival(props) {

    // A new row that is an emplacement
    const emptyRow = {
        libelleEmplacement: "",
        coutTable: "",
        coutMetreCarre: "",
        nombreTablesPrevues: ""
    }

    // A new row to indicate the errors in an emplacement
    const emptyRowErr = {
        libelleEmplacementErr: 0,
        coutTableErr: 0,
        coutMetreCarreErr: 0,
        nombreTablesPrevuesErr: 0,
    }

    // Init the fields with the festival info
    const initInputsUpdate = (festival) => {
        const emplacements = festival.emplacements
        const rows = [emplacements.length]
        for (let i = 0; i < emplacements.length; i++) {
            rows[i] = [emptyRow]
            rows[i].libelleEmplacement = emplacements[i].libelleEmplacement
            rows[i].coutTable = emplacements[i].coutTable
            rows[i].coutMetreCarre = emplacements[i].coutMetreCarre
            rows[i].nombreTablesPrevues = emplacements[i].nombreTablesPrevues
        }
        return rows
    }

    // Init the errors for the festival
    const initInputErrorsUpdate = (festival) => {
        const emplacements = festival.emplacements
        const rowsErr = {
            nameFestivalErr: 0,
            generalStatus: 0,
            emplacementsErr: [emplacements.length]
        }
        for (let i = 0; i < emplacements.length; i++) {
            rowsErr.emplacementsErr[i] = emptyRowErr
        }
        return rowsErr
    }

    // The festival displayed, if we're updating
    const [festival, setFestival] = useState(props.festival)
    // Name of the festival
    const [nameFestival, setNameFestival] = useState(props.componentState === 1 ? festival.nameFestival : "")
    // The inputs for the emplacements
    const [rowsInput, setRowInput] = useState(props.componentState === 1 ? initInputsUpdate(festival) : [emptyRow])
    // To handle the errors the server spots
    const [errInputs, setErrInputs] = useState(props.componentState === 1 ? initInputErrorsUpdate(festival)
        : {
            generalStatus: 0,
            nameFestivalErr: 0,
            emplacementsErr: [emptyRowErr]
        })
    // Waiting for server action
    const [isCharging, setIsCharging] = useState(false)
    const [error, setError] = useState(null)

    // We change the festival
    useEffect(() => {
        setFestival(props.festival)
        if (props.componentState === 1) {
            setNameFestival(props.festival.nameFestival)
            setRowInput(initInputsUpdate(props.festival))
            setErrInputs(initInputErrorsUpdate(props.festival))
        }
    }, [props.festival])

    // We add a new row, a new emplacement
    const addRow = () => {
        setRowInput(prevState => (prevState.concat([emptyRow])));
        let newErrInputs = errInputs
        newErrInputs.emplacementsErr.push(emptyRowErr)
        setErrInputs(newErrInputs);
    }

    // We delete the last row created
    const deleteRow = () => {
        if (rowsInput.length > 1) {
            let newRowsInput = [...rowsInput];
            newRowsInput.splice(newRowsInput.length - 1, 1);
            setRowInput(newRowsInput);
            let newErrInputs = errInputs
            newErrInputs.emplacementsErr.splice(newErrInputs.emplacementsErr.length - 1, 1);
            setErrInputs(newErrInputs);
        }
    }

    // Update the content of the emplacements inputs
    const updateInputState = (event, index) => {
        let newValue = [...rowsInput]
        newValue[index][event.target.id] = event.target.value
        setRowInput(newValue)
        // We remove the errors indicators
        let newErrInputs = errInputs
        newErrInputs.emplacementsErr[index][event.target.id + "Err"] = 0
        setErrInputs(newErrInputs);
    }

    // Clear all the inputs
    const setDefaultInput = () => {
        setRowInput([emptyRow])
        setErrInputs({
            idFestival: 0,
            generalStatus: 0,
            nameFestivalErr: 0,
            emplacementsErr: [emptyRowErr]
        })
        setNameFestival("")
    }

    // Send the request to the server to create the festival
    const createFestival = () => {
        setError(null)
        setIsCharging(true)
        const data = {
            nameFestival,
            emplacements: rowsInput
        }
        Axios.post('/api/gestion/festival', data, {headers: {Authorization: token.getToken()}})
            .then(({data}) => {
                switch (data.generalStatus) {
                    case 0:
                        // We add the new festival in the parent component
                        props.addNewFestival(data.newFestival)
                        props.setModalState(false)
                        // We clear the inputs
                        setDefaultInput()
                        break;
                    case 1:
                        // There are errors
                        setErrInputs(data)
                        break
                }
                setIsCharging(false)
            })
            .catch((err) => {
                setError(err.message)
                setIsCharging(false)
                if (err.response.data.code === 0) {
                    token.destroyToken()
                }
            })
    }

    // Send a request to the server to update a festival
    const updateNameFestival = () => {
        setError(null)
        setIsCharging(true)
        const data = {
            nameFestival,
            idFestival: festival.idFestival
        }
        Axios.put('/api/gestion/festival', data, {headers: {Authorization: token.getToken()}})
            .then(({data}) => {
                switch (data.generalStatus) {
                    case 0:
                        // Everything went perfectly
                        props.setModalState(false)
                        // We change it in the parent component
                        props.updateFestival(festival.idFestival, nameFestival)
                        break;
                    case 1:
                        // An error occured
                        const newErrInputs = errInputs
                        errInputs.nameFestivalErr = 1
                        setErrInputs(newErrInputs)
                        break;
                }
                setIsCharging(false)
            })
            .catch((err) => {
                setError(err.message)
                setIsCharging(false)
                if (err.response.data.code === 0) {
                    token.destroyToken()
                }
            })
    }

    return (
        <div>
            <Modal
                className="modal-dialog-centered"
                size="xl"
                isOpen={props.modalState}
                toggle={() => props.setModalState(!props.modalState)}
            >
                <div className="modal-body p-0">
                    <Card className="bg-secondary shadow border-0">
                        <Form role="form">
                            <CardHeader className="bg-transparent pb-5">
                                <h1 className="text-center text-xl-center font-weight-900">{props.componentState === 0 ?
                                    "Créer un nouveau festival" :
                                    "Modifier un festival"}</h1>
                                <div className="text-muted text-center mt-2 mb-3">
                                    Nom du Festival
                                </div>
                                <FormGroup className="mb-3">
                                    <Row className="text-center">
                                        <Col md="6" className={props.componentState === 0 ? 'center' : ''}>
                                            <InputGroup className={errInputs.nameFestivalErr === 1 ? 'has-danger' : ''}>
                                                <Input placeholder="Nom du festival ..."
                                                       type="text"
                                                       className={errInputs.nameFestivalErr === 1 ? 'is-invalid' : ''}
                                                       name="nameFestival"
                                                       value={nameFestival}
                                                       onChange={(event) => {
                                                           setNameFestival(event.target.value)
                                                           let newErrInputs = errInputs
                                                           newErrInputs.nameFestivalErr = 0
                                                           setErrInputs(newErrInputs);
                                                       }}
                                                />
                                            </InputGroup>
                                        </Col>
                                        {(props.componentState === 1) &&
                                        ((!isCharging) ?
                                            <Col>
                                                <Button
                                                    outline
                                                    color="success"
                                                    type="button"
                                                    onClick={() => updateNameFestival()}
                                                >
                                                    Sauvegarder
                                                </Button>
                                            </Col> :
                                            <Col>
                                                <Waiting/>
                                            </Col>)}
                                    </Row>
                                </FormGroup>
                            </CardHeader>
                            <CardBody className="px-lg-5 py-lg-5">
                                <Row className="text-right mb-3">
                                    <Col md="10">
                                        <div className="text-muted text-center mt-2 mb-3">
                                            Emplacements du Festival
                                        </div>
                                    </Col>
                                    {props.componentState === 0 &&
                                    <Col>
                                        <Button className="btn-icon btn-2" size="sm" color="danger" type="button"
                                                onClick={() => deleteRow()}>
                                            <span className="btn-inner--icon">
                                                <i className="ni ni-fat-delete"/>
                                            </span>
                                        </Button>
                                        <Button className="btn-icon btn-2" size="sm" color="success" type="button"
                                                onClick={() => addRow()}>
                                            <span className="btn-inner--icon">
                                                <i className="ni ni-fat-add"/>
                                            </span>
                                        </Button>
                                    </Col>}
                                </Row>
                                <Row>
                                    <Col md="4">
                                        <span className="text-muted">
                                            Nom de l'emplacement
                                        </span>
                                    </Col>
                                    <Col>
                                        <span className="text-muted">
                                            Coût par table
                                        </span>
                                    </Col>
                                    <Col>
                                        <span className="text-muted">
                                            Coût par m²
                                        </span>
                                    </Col>
                                    <Col>
                                        <span className="text-muted">
                                            Nombre de tables prévues
                                        </span>
                                    </Col>
                                </Row>

                                {rowsInput.map((input, index) => {
                                    return (
                                        <Row key={index}>
                                            <Col md="4">
                                                <FormGroup
                                                    className={errInputs.emplacementsErr[index].libelleEmplacementErr === 1 ? 'has-danger' : ''}>
                                                    <Input
                                                        placeholder="Nom de l'emplacement ..."
                                                        type="text"
                                                        disabled={props.componentState === 1 && "disabled"}
                                                        className={errInputs.emplacementsErr[index].libelleEmplacementErr === 1 ? 'is-invalid' : ''}
                                                        id='libelleEmplacement'
                                                        value={input.libelleEmplacement}
                                                        onChange={(event) => updateInputState(event, index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup
                                                    className={errInputs.emplacementsErr[index].coutTableErr === 1 ? 'has-danger' : ''}>
                                                    <Input
                                                        placeholder="Coût par table ..."
                                                        id='coutTable'
                                                        type="text"
                                                        disabled={props.componentState === 1 && "disabled"}
                                                        className={errInputs.emplacementsErr[index].coutTableErr === 1 ? 'is-invalid' : ''}
                                                        value={input.coutTable}
                                                        onChange={(event) => updateInputState(event, index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup
                                                    className={errInputs.emplacementsErr[index].coutMetreCarreErr === 1 ? 'has-danger' : ''}>
                                                    <Input
                                                        placeholder="Coût par m² ..."
                                                        id='coutMetreCarre'
                                                        disabled={props.componentState === 1 && "disabled"}
                                                        type="text"
                                                        className={errInputs.emplacementsErr[index].coutMetreCarreErr === 1 ? 'is-invalid' : ''}
                                                        value={input.coutMetreCarre}
                                                        onChange={(event) => updateInputState(event, index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup
                                                    className={errInputs.emplacementsErr[index].nombreTablesPrevuesErr === 1 ? 'has-danger' : ''}>
                                                    <Input
                                                        placeholder="Nombre de tables prévues ..."
                                                        id='nombreTablesPrevues'
                                                        disabled={props.componentState === 1 && "disabled"}
                                                        type="text"
                                                        className={errInputs.emplacementsErr[index].nombreTablesPrevuesErr === 1 ? 'is-invalid' : ''}
                                                        value={input.nombreTablesPrevues}
                                                        onChange={(event) => updateInputState(event, index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    )
                                })}
                                {error === null ?
                                    (isCharging ? <Waiting
                                            name={props.componentState === 0 ? "Création du festival" : "Mise à jour du festival"}/> :
                                        <div className="btn-wrapper text-center my-4">
                                            <Button
                                                outline
                                                color="danger"
                                                onClick={() => {
                                                    props.setModalState(!props.modalState)
                                                    if (props.componentState === 0) {
                                                        setDefaultInput()
                                                    } else {
                                                        setNameFestival(festival.nameFestival)
                                                    }
                                                }}
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                outline
                                                color="success"
                                                type="button"
                                                onClick={() => {
                                                    (props.componentState === 0) ? createFestival()
                                                        : updateNameFestival()
                                                }}>
                                                {props.componentState === 0 ? "Créer" : "Sauvegarder"}
                                            </Button>
                                        </div>) :
                                    <Alert color="danger" className="text-center">
                                        {error}
                                    </Alert>}
                            </CardBody>
                        </Form>
                    </Card>
                </div>
            </Modal>
        </div>
    )
}

export default CreateUpdateFestival