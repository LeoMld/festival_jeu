import React from 'react'

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
                                <div className="text-muted text-center mt-2 mb-3">
                                    Nom du Festival
                                </div>
                                <FormGroup className="mb-3">
                                    <Row className="text-center">
                                        <Col md="8">
                                            <InputGroup className="input-group-alternative">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="ni ni-badge"/>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input placeholder="Nom du festival ..." type="text"/>
                                            </InputGroup>
                                        </Col>
                                        <Col>
                                            <Button
                                                outline
                                                color="success"
                                                type="button"
                                            >
                                                Sauvegarder
                                            </Button>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </CardHeader>
                            <CardBody className="px-lg-5 py-lg-5">
                                <div className="text-muted text-center mt-2 mb-3">
                                    Emplacements du Festival
                                </div>
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