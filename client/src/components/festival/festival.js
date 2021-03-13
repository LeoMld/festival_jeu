import React, {useState} from 'react'

import {
    Table,
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

function Festival() {

    const [modalUpdate, setModalUpdate] = useState(false)

    return (
        <>
            <Table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
                </tbody>
            </Table>
            <Button
                block
                color="default"
                type="button"
                onClick={() => setModalUpdate(!modalUpdate)}
            >
                Modifier
            </Button>

            <Modal
                className="modal-dialog-centered"
                size="xl"
                isOpen={modalUpdate}
                toggle={() => setModalUpdate(!modalUpdate)}
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
                                        onClick={() => setModalUpdate(!modalUpdate)}
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
        </>
    )
        ;
}

export default Festival