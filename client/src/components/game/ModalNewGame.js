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
    InputGroupAddon,
    InputGroupText,
    Label,
    Modal,
    Row
} from "reactstrap";
import React, {useState} from "react";
import Axios from "axios";
import Waiting from "../utils/Waiting";
import token from "../../utils/token";
import useAxios from "../../utils/useAxios";

import among_green from "../../assets/images/amongus/among-green.png"


function ModalNewGame(props) {


    let game = {}

    const [errorLibelle, setErrorLibelle] = useState(false)
    const [isChanging, setIsChanging] = useState(false)
    const [errorPost, setErrorPost] = useState(false)


    const {
        data: types,
        setData: setTypes,
        isPending: isPendingTypes,
        error: errorTypes
    } = useAxios("/api/games/TypesJeux")
    const {
        data: persons,
        setData: setPersons,
        isPending: isPendingPersons,
        error: errorPersons
    } = useAxios("/api/gestion/editeurs")

    const addGameView = (game) => {
        if (props.type === 1) {
            const newGames = props.games.games
            newGames.push(game)
            props.setGames({...props.games, games: newGames})
        } else {
            const newGames = props.games
            newGames.push(game)
            props.setGames(newGames)
        }
    }

        const handleChange = () => {
            if (document.getElementById("libelle").value.length > 1) {
                setIsChanging(true)
                setErrorLibelle(false)

                game.FK_idPersonne = parseInt(document.getElementById("proprietaire").value)
                game.FK_idTypeJeu = parseInt(document.getElementById("typeJeu").value)
                game.prototype = document.getElementById("prototype").checked
                game.libelleJeu = document.getElementById("libelle").value
                game.duree = document.getElementById("duree").value
                game.nombreJoueur = document.getElementById("nombreJoueur").value
                game.ageMinimum = parseInt(document.getElementById("age").value)
                game.libelleTypeJeu = document.getElementById("typeJeu"+game.FK_idTypeJeu).text
                game.nomPersonne = document.getElementById("proprietaire"+game.FK_idPersonne).text


                Axios.post('/api/games/', {game}, {headers: {Authorization: token.getToken()}})
                    .then(res => {
                        game.idJeu = res.data.idJeu
                        addGameView(game)

                        props.setModalState(!props.modalState)
                        setIsChanging(false)

                    }).catch(e => {
                    setIsChanging(false)
                    setErrorPost(true)
                    //if the token is not the good one
                    if (e.response.data.code === 0) {
                        token.destroyToken()
                    }
                })
            } else {
                setErrorLibelle(true)

            }


        }


        return (

            <Modal
                className="modal-dialog-centered"
                size="lg"
                isOpen={props.modalState}
                toggle={() => props.setModalState(!props.modalState)}
            >
                <div className="modal-body p-0">
                    <Card className="bg-secondary shadow border-0">
                        <div className="mr-sm-3 mt-sm-3">
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => props.setModalState(!props.modalState)}
                            >
                                <span aria-hidden={true}>×</span>
                            </button>
                        </div>
                        <CardHeader className="bg-transparent pb-5">
                            <div className="text-muted text-center mt-2 mb-3">
                                <h3>Ajouter un jeu</h3>
                                <img
                                    style={{height: "80px"}}
                                    alt="logo"
                                    className="img-fluid floating"
                                    src={among_green}
                                />
                            </div>
                        </CardHeader>

                        {(isPendingPersons || isPendingTypes) && <Waiting className="mt-md" name={"Loading data"}/>}

                        {!isPendingPersons && !isPendingTypes && <CardBody className="px-lg-5 py-lg-5">
                            <Form role="form">
                                <FormGroup className="mb-3">
                                    <Label for="libelle">Libelle du jeu</Label>
                                    <InputGroup className="input-group-alternative is-invalid">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-app"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="libelle" placeholder="libelle du Jeu" type="text"/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Label for="nombreJoueur">nombreJoueur</Label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-single-02"/>
                                            </InputGroupText>
                                        </InputGroupAddon>

                                        <Input id="nombreJoueur" type="select" name="select">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                            <option>6</option>
                                            <option>7</option>
                                            <option>7+</option>
                                        </Input>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Label for="proprietaire">Propriétaire</Label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-single-02"/>
                                            </InputGroupText>
                                        </InputGroupAddon>

                                        {persons && <Input id="proprietaire" type="select" name="select">
                                            {persons.map((person, index) => {
                                                return (
                                                    <option id={"proprietaire"+person.idPersonne} key={index}
                                                            value={person.idPersonne}>{person.nomPersonne}</option>
                                                )

                                            })}


                                        </Input>}
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Col>
                                        <Row><label>Prototype</label></Row>
                                    </Col>
                                    <Col>
                                        <label htmlFor="prototype" className="custom-toggle">
                                            <input id="prototype" type="checkbox" />
                                            <span className="custom-toggle-slider rounded-circle"/>
                                        </label>
                                    </Col>

                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label for="typeJeu">Type du jeu</Label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-single-02"/>
                                            </InputGroupText>
                                        </InputGroupAddon>

                                        <Input id="typeJeu" type="select" name="select">
                                            {types.data.map((type, index) => {
                                                return (
                                                    <option id={"typeJeu"+type.idTypeJeu} key={index}
                                                            value={type.idTypeJeu}>{type.libelleTypeJeu}</option>
                                                )

                                            })}


                                        </Input>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Label for="age">Âge minimum</Label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-badge"/>
                                            </InputGroupText>
                                        </InputGroupAddon>

                                        <Input id="age" type="select" name="select">
                                            <option>2</option>
                                            <option>5</option>
                                            <option>8</option>
                                            <option>10</option>
                                            <option>12</option>
                                            <option>16</option>
                                            <option>18</option>

                                        </Input>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="duree">Durée</Label>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-watch-time"/>
                                            </InputGroupText>
                                        </InputGroupAddon>

                                        <Input id="duree" placeholder="durée" type="text"/>
                                    </InputGroup>
                                </FormGroup>
                                {errorLibelle && <Alert color="danger">
                                    Veuillez renseigner un libelle au jeu
                                </Alert>}
                                {!isChanging && <div className="text-center">
                                    <Button
                                        onClick={() => {
                                            handleChange()
                                        }}
                                        className="my-4"
                                        color="primary"
                                        type="button"
                                    >
                                        Créer un jeu
                                    </Button>
                                </div>}

                                {isChanging && <Waiting className="mt-md" name={"Change"}/>}
                            </Form>
                        </CardBody>}
                    </Card>
                </div>
                {errorPersons && <Alert color="danger">
                    Erreur lors de l'ajout, veuillez recharger la page et réessayer
                </Alert>}

                {(errorPost || errorTypes) && <Alert color="danger">
                    Erreur lors du chargement des données, veuillez recharger la page et réessayer
                </Alert>}
            </Modal>


        )

}

export default ModalNewGame
