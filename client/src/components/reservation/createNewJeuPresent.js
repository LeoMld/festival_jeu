import React, {useState} from 'react'
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
import useAxios from "../../utils/useAxios";
import token from "../../utils/token";
import Axios from "axios";

function CreateNewJeuPresent(props) {

    const {data: allGames, setData: setAllGames, isPending, error} = useAxios('/api/games/')

    const [prixRenvoi, setPrixRenvoi] = useState(0)

    const [isCharging, setIsCharging] = useState(false)
    const [errorAdd, setErrorAdd] = useState(null)

    // We add the game in the reservation
    const addJeuReserve = () => {
        setIsCharging(true)
        if (!isNaN(prixRenvoi)) {
            const data = {
                idJeu: parseInt(document.getElementById("gameSelector").value),
                idZone: parseInt(document.getElementById("zoneSelector").value),
                idReservation: props.info.idReservation,
                prixRenvoi: parseFloat(prixRenvoi)
            }
            Axios.post('/api/gestion/jeuPresent', data, {headers: {Authorization: token.getToken()}})
                .then(({data}) => {
                    // We update the view with the new game
                    props.addNewGameReservation(data)
                    setIsCharging(false)
                    props.setModalState(false)
                })
                .catch((err) => {
                    setIsCharging(false)
                    setErrorAdd(err.message)
                })
        }
    }

    // Used to only put the games not in the reservation in the selector
    const gameAlreadyIn = (idJeu) => {
        return !(props.info.jeuPresents.filter(g => idJeu === g.PK_idJeu).length === 0)
    }

    return (
        <div>
            <Modal
                className="modal-dialog-centered"
                size="xl"
                isOpen={props.modalState}
                toggle={() => props.setModalState(!props.modalState)}>
                {isPending ? <Waiting/> :
                    props.info.jeuPresents.length !== allGames.length ?
                        <div className="modal-body p-0">
                            <Card className="bg-secondary shadow border-0">
                                <Form role="form">
                                    <CardHeader className="bg-transparent pb-5">
                                        <h1 className="text-center text-xl-center font-weight-900">
                                            Ajouter un jeu à la réservation</h1>
                                    </CardHeader>
                                    <CardBody className="px-lg-5 py-lg-5">
                                        <div className="text-muted text-center mt-2 mb-3">
                                            Jeu à ajouter
                                        </div>
                                        <Row className="text-center">
                                            <Col md="6" className="center">
                                                <Input type="select"
                                                       name="select"
                                                       id="gameSelector"
                                                       defaultValue={allGames[0].idJeu}>
                                                    size="sm">
                                                    {allGames.map((g, index) => {
                                                            if (!gameAlreadyIn(g.idJeu)) {
                                                                return (
                                                                    <option value={g.idJeu}
                                                                            key={index}>{g.libelleJeu}</option>
                                                                )
                                                            }
                                                        }
                                                    )}
                                                </Input>
                                            </Col>
                                        </Row>
                                        <div className="text-muted text-center mt-2 mb-3">
                                            Prix de renvoi
                                        </div>
                                        <FormGroup className="mb-3">
                                            <Row className="text-center">
                                                <Col md="6" className="center">
                                                    <InputGroup>
                                                        <Input placeholder="Prix de renvoi ..."
                                                               type="text"
                                                               name="nameZone"
                                                               value={prixRenvoi}
                                                               onChange={(event) => {
                                                                   setPrixRenvoi(event.target.value)
                                                               }}
                                                        />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        <div className="text-muted text-center mt-2 mb-3">
                                            Zone
                                        </div>
                                        <Row className="text-center">
                                            <Col md="6" className="center">
                                                <Input type="select"
                                                       name="select"
                                                       id="zoneSelector"
                                                       defaultValue={props.info.zones[0].idZone}>
                                                    size="sm">
                                                    {props.info.zones.map((z, index) => {
                                                            return (
                                                                <option value={z.idZone}
                                                                        key={index}>{z.libelleZone}</option>
                                                            )
                                                        }
                                                    )}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errorAdd === null ?
                                            (isCharging ? <Waiting
                                                    name="Ajout du jeu"/> :
                                                <div className="btn-wrapper text-center my-4">
                                                    <Button
                                                        outline
                                                        color="danger"
                                                        onClick={() => {
                                                            props.setModalState(!props.modalState)
                                                            setPrixRenvoi(0)
                                                        }}
                                                    >
                                                        Annuler
                                                    </Button>
                                                    <Button
                                                        outline
                                                        color="success"
                                                        type="button"
                                                        disabled={isNaN(prixRenvoi)}
                                                        onClick={() => addJeuReserve()}>
                                                        Ajouter
                                                    </Button>
                                                </div>) :
                                            <Alert color="danger" className="text-center">
                                                {errorAdd}
                                            </Alert>}
                                    </CardBody>
                                </Form>
                            </Card>
                        </div> :
                        <CardHeader className="text-center">
                            <Alert color="warning">Vous ne pouvez pas ajouter plus de jeux dans cette
                                réservation.</Alert>
                            <Button color="warning"
                                    outline
                                    onClick={() => props.setModalState(false)}>
                                Ok
                            </Button>
                        </CardHeader>
                }
            </Modal>
        </div>
    )
}

export default CreateNewJeuPresent;