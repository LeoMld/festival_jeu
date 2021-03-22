import React, {useState, useEffect} from 'react'
import Axios from 'axios'

import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup,
    Modal,
    Row
} from "reactstrap";

import Waiting from "../utils/Waiting";
import token from "../../utils/token";

function CreateUpdateZone(props) {

    // The zone displayed, if we're updating
    const [zone, setZone] = useState(props.zone)

    const [nameZone, setNameZone] = useState(props.componentState === 1 ? zone.libelleZone : "")
    const [errInput, setErrInput] = useState(false)

    const [isCharging, setIsCharging] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setZone(props.zone)
        if (props.componentState === 1) {
            setNameZone(props.zone.libelleZone)
        }
    }, [props.zone])

    // We create a zone on the server for this festival
    const createZone = () => {
        setError(null)
        setIsCharging(true)
        Axios.post('/api/gestion/zone', {libelleZone: nameZone}, {headers: {Authorization: token.getToken()}})
            .then(({data}) => {
                switch (data.status) {
                    case 0:
                        data.newZone.games = []
                        // We add the new zone in the parent component
                        props.addNewZone(data.newZone)
                        props.setModalState(false)
                        // We clear the input
                        setNameZone("")
                        break;
                    default:
                        // Not a valid input
                        setErrInput(true)
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

    // The user wants to update the name of a zone
    const updateZone = () => {
        setError(null)
        setIsCharging(true)
        Axios.put('/api/gestion/zone/' + zone.idZone, {libelleZone: nameZone}, {headers: {Authorization: token.getToken()}})
            .then(({data}) => {
                switch (data.status) {
                    case 0:
                        // We update the new zone in the parent component
                        props.updateZone(zone.idZone, nameZone)
                        props.setModalState(false)
                        break;
                    default:
                        // Not a valid input
                        setErrInput(true)
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
                                    "Créer une nouvelle zone" :
                                    "Modifier une zone"}</h1>
                            </CardHeader>
                            <CardBody className="px-lg-5 py-lg-5">
                                <div className="text-muted text-center mt-2 mb-3">
                                    Nom de la zone
                                </div>
                                <FormGroup className="mb-3">
                                    <Row className="text-center">
                                        <Col md="6" className="center">
                                            <InputGroup className={errInput ? 'has-danger' : ''}>
                                                <Input placeholder="Nom de la zone ..."
                                                       type="text"
                                                       className={errInput ? 'is-invalid' : ''}
                                                       name="nameZone"
                                                       value={nameZone}
                                                       onChange={(event) => {
                                                           setNameZone(event.target.value)
                                                           setErrInput(false);
                                                       }}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                {error === null ?
                                    (isCharging ? <Waiting
                                            name={props.componentState === 0 ? "Création de la zone" : "Mise à jour de la zone"}/> :
                                        <div className="btn-wrapper text-center my-4">
                                            <Button
                                                outline
                                                color="danger"
                                                onClick={() => {
                                                    props.setModalState(!props.modalState)
                                                    setErrInput(false)
                                                    if (props.componentState === 0) {
                                                        setNameZone("")
                                                    } else {
                                                        setNameZone(zone.libelleZone)
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
                                                    (props.componentState === 0) ? createZone()
                                                        : updateZone()
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

export default CreateUpdateZone