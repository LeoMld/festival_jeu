import React, {useState} from 'react'
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
    Row
} from 'reactstrap';
import Waiting from "../utils/Waiting";

function CreateUpdateFestival(props) {

    // A new emplacement
    const emptyRow = {
        libelleEmplacement: "",
        coutTable: "",
        coutMetreCarre: "",
        nombreTablesPrevues: ""
    }

    // Row to indicate the errors in an emplacement
    const emptyRowErr = {
        libelleEmplacementErr: 0,
        coutTableErr: 0,
        coutMetreCarreErr: 0,
        nombreTablesPrevuesErr: 0,
    }

    // Emplacements
    const [rowsInput, setRowInput] = useState([emptyRow])
    const [nameFestival, setNameFestival] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    // To handle the errors the server spots
    const [errInputs, setErrInputs] = useState({
        idFestival: 0,
        generalStatus: 0,
        nameFestivalErr: 0,
        emplacementsErr: [emptyRowErr]
    })

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

    // Update the content of the inputs
    const updateInputState = (event, index) => {
        let newValue = [...rowsInput]
        newValue[index][event.target.id] = event.target.value
        setRowInput(newValue)
        // We remove the errors indicators
        let newErrInputs = errInputs
        newErrInputs.emplacementsErr[index][event.target.id + "Err"] = 0
        setErrInputs(newErrInputs);
    }

    // Send the request to the server to create the festival
    const createFestival = () => {
        setIsCreating(true)
        const data = {
            nameFestival,
            emplacements: rowsInput
        }
        Axios.post('/api/gestion/createFestival', data)
            .then(({data}) => {
                setIsCreating(false)
                switch (data.generalStatus) {
                    case 0:
                        // We add the new festival in the parent component
                        const newFestival = data.newFestival
                        for (let i = 0; i < newFestival.emplacements.length; i++) {
                            newFestival.emplacements[i].numberTables = 0
                            newFestival.emplacements[i].numberSquareMeters = 0
                            newFestival.emplacements[i].availableTables = newFestival.emplacements[i].nombreTablesPrevues
                        }
                        props.addNewFestival(newFestival)
                        props.setModalState(false)
                        // We clear the inputs
                        setDefaultInput()
                        break;
                    case 1:
                        // There are errors
                        setErrInputs(data)
                        break
                }
            })
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
                                <h1 className="text-center text-xl-center font-weight-900">Créer un nouveau
                                    festival</h1>
                                <div className="text-muted text-center mt-2 mb-3">
                                    Nom du Festival
                                </div>
                                <FormGroup className="mb-3">
                                    <Row className="text-center">
                                        <Col md="6" className={props.componentState === 0 && "center"}>
                                            <InputGroup className={(errInputs.nameFestivalErr === 1 && 'has-danger')}>

                                                <Input placeholder="Nom du festival ..."
                                                       type="text"
                                                       className={(errInputs.nameFestivalErr === 1 && 'is-invalid')}
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
                                        {props.componentState === 1 &&
                                        <Col>
                                            <Button
                                                outline
                                                color="success"
                                                type="button"
                                            >
                                                Sauvegarder
                                            </Button>
                                        </Col>}
                                    </Row>
                                </FormGroup>
                            </CardHeader>
                            <CardBody className="px-lg-5 py-lg-5">
                                <Row className="text-right">
                                    <Col md="10">
                                        <div className="text-muted text-center mt-2 mb-3">
                                            Emplacements du Festival (nom, coût/table, coût/mètre carré,
                                            nombre de tables prévues)
                                        </div>
                                    </Col>
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
                                    </Col>
                                </Row>

                                {rowsInput.map((input, index) => {
                                    return (
                                        <Row>
                                            <Col md="4">
                                                <FormGroup
                                                    className={(errInputs.emplacementsErr[index].libelleEmplacementErr === 1 && 'has-danger')}>
                                                    <Input
                                                        placeholder="Nom de l'emplacement ..."
                                                        type="text"
                                                        className={(errInputs.emplacementsErr[index].libelleEmplacementErr === 1 && 'is-invalid')}
                                                        id='libelleEmplacement'
                                                        value={input.libelleEmplacement}
                                                        onChange={(event) => updateInputState(event, index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup
                                                    className={(errInputs.emplacementsErr[index].coutTableErr === 1 && 'has-danger')}>
                                                    <Input
                                                        placeholder="Coût par table ..."
                                                        id='coutTable'
                                                        type="text"
                                                        className={(errInputs.emplacementsErr[index].coutTableErr === 1 && 'is-invalid')}
                                                        value={input.coutTable}
                                                        onChange={(event) => updateInputState(event, index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup
                                                    className={(errInputs.emplacementsErr[index].coutMetreCarreErr === 1 && 'has-danger')}>
                                                    <Input
                                                        placeholder="Coût par m² ..."
                                                        id='coutMetreCarre'
                                                        type="text"
                                                        className={(errInputs.emplacementsErr[index].coutMetreCarreErr === 1 && 'is-invalid')}
                                                        value={input.coutMetreCarre}
                                                        onChange={(event) => updateInputState(event, index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup
                                                    className={(errInputs.emplacementsErr[index].nombreTablesPrevuesErr === 1 && 'has-danger')}>
                                                    <Input
                                                        placeholder="Nombre de tables prévues ..."
                                                        id='nombreTablesPrevues'
                                                        type="text"
                                                        className={(errInputs.emplacementsErr[index].nombreTablesPrevuesErr === 1 && 'is-invalid')}
                                                        value={input.nombreTablesPrevues}
                                                        onChange={(event) => updateInputState(event, index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    )
                                })}
                                {isCreating ? <Waiting name = "Création du festival"/> :
                                    <div className="btn-wrapper text-center my-4">
                                        <Button
                                            outline
                                            color="danger"
                                            onClick={() => {
                                                props.setModalState(!props.modalState)
                                                setDefaultInput()
                                            }}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            outline
                                            color="success"
                                            type="button"
                                            onClick={() => createFestival()}
                                        >
                                            Sauvegarder
                                        </Button>
                                    </div>}
                            </CardBody>
                        </Form>
                    </Card>
                </div>
            </Modal>
        </div>
    )
}

export default CreateUpdateFestival