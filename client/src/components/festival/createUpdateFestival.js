import React, {useState} from 'react'

import {
    Button,
    Modal,
    Card,
    CardHeader,
    Form,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    CardBody,
    Col,
    Row
} from 'reactstrap';

function CreateUpdateFestival(props) {

    const [rowsInput, setRowInput] = useState([{
        libelleEmplacement : "",
        coutTable : "",
        coutMetreCarre : "",
        nombreTablesPrevues : ""
    }])
    const [nameFestival, setNameFestival] = useState("")

    // We add a new row, a new emplacement
    const addRow = () => {
        let newRow = {
            libelleEmplacement : "",
            coutTable : "",
            coutMetreCarre : "",
            nombreTablesPrevues : ""
        }
        setRowInput(prevState => (prevState.concat([newRow])));
    }

    // We delete the last row created
    const deleteRow = () => {
        if (rowsInput.length > 1) {
            const newRowsInput = [...rowsInput];
            newRowsInput.splice(newRowsInput.length-1, 1);
            setRowInput(newRowsInput);
        }
    }

    // Update the content of the inputs
    const updateInputState = (event,index) => {
        let newValue = [...rowsInput]
        newValue[index][event.target.id] = event.target.value
        setRowInput(newValue)
    }

    // Send the request to the server to create the festival
    const createFestival = () => {
        const data = {
            nameFestival,
            emplacements : rowsInput
        }

        console.log(data)
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
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-badge"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input placeholder="Nom du festival ..."
                                                       type="text"
                                                       name="nameFestival"
                                                       value={nameFestival}
                                                       onChange={(event) => setNameFestival(event.target.value)}
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
                                    <Col>
                                        <div className="text-muted text-center mt-2 mb-3">
                                            Emplacements du Festival
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
                                                <FormGroup>
                                                    <Input
                                                        placeholder="Nom de l'emplacement ..."
                                                        type="text"
                                                        id='libelleEmplacement'
                                                        value={input.libelleEmplacement}
                                                        onChange={(event) => updateInputState(event,index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Input
                                                        placeholder="Coût par table ..."
                                                        id='coutTable'
                                                        type="text"
                                                        value={input.coutTable}
                                                        onChange={(event) => updateInputState(event,index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Input
                                                        placeholder="Coût par m² ..."
                                                        id='coutMetreCarre'
                                                        type="text"
                                                        value={input.coutMetreCarre}
                                                        onChange={(event) => updateInputState(event,index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col>
                                                <FormGroup>
                                                    <Input
                                                        placeholder="Nombre de tables prévues ..."
                                                        id='nombreTablesPrevues'
                                                        type="text"
                                                        value={input.nombreTablesPrevues}
                                                        onChange={(event) => updateInputState(event,index)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    )
                                })}

                                <div className="btn-wrapper text-center my-4">
                                    <Button
                                        outline
                                        color="danger"
                                        onClick={() => props.setModalState(!props.modalState)}
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
                                </div>
                            </CardBody>
                        </Form>
                    </Card>
                </div>
            </Modal>
        </div>
    )
}

export default CreateUpdateFestival