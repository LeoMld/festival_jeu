import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Modal
} from "reactstrap";
import React, {useState} from "react";
import Axios from "axios";
import Waiting from "../utils/Waiting";
import token from "../../utils/token";

import among_modify from "../../assets/images/amongus/among_modify.png"

function ModalGame(props) {

    const [isChanging, setIsChanging] = useState(false)
    const [error, setError] = useState(false)


    const handleChange = (game) => {
        setIsChanging(true)

        props.game.libelleJeu = document.getElementById("libelleChamp").value
        props.game.duree = document.getElementById("duree").value
        props.game.nombreJoueur = document.getElementById("nombreJoueur").value
        props.game.ageMinimum = document.getElementById("age").value


        Axios.put('/api/games/' + props.game.idJeu, {game}, {headers: {Authorization: token.getToken()}})
            .then(res => {
                props.setModalState(!props.modalState)
                setIsChanging(false)
            }).catch(e => {
            setIsChanging(false)
            setError(true)
            //if the token is not the good one
            if (e.response.data.code === 0) {
                token.destroyToken()
            }
        })


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
                            <h3>Modifier le jeu</h3>
                            <img
                                style={{height: "100px"}}
                                alt="logo"
                                className="img-fluid floating"
                                src={among_modify}
                            />
                        </div>

                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                        {props.game != null && <Form role="form">
                            <FormGroup className="mb-3">
                                <Label for="libelleChamp">Libelle du jeu</Label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-app"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input id="libelleChamp" defaultValue={props.game.libelleJeu}
                                           placeholder="Libellé du Jeu" type="text"/>
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

                                    <Input id="nombreJoueur" type="select" defaultValue={props.game.nombreJoueur}
                                           name="select">
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
                                <Label for="age">Âge minimum</Label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-badge"/>
                                        </InputGroupText>
                                    </InputGroupAddon>

                                    <Input id="age" type="select" defaultValue={props.game.ageMinimum} name="select">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                        <option>11</option>
                                        <option>12</option>
                                        <option>13</option>
                                        <option>14</option>
                                        <option>15</option>
                                        <option>16</option>
                                        <option>17</option>
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

                                    <Input defaultValue={props.game.duree} id="duree" placeholder="Durée" type="text"/>
                                </InputGroup>
                            </FormGroup>

                            {!isChanging && <div className="text-center">
                                <Button
                                    onClick={() => {
                                        handleChange(props.game)
                                    }}
                                    className="my-4"
                                    color="primary"
                                    type="button"
                                >
                                    Valider les changements
                                </Button>
                            </div>}
                            {isChanging && <Waiting className="mt-md" name={"Change"}/>}
                        </Form>}
                    </CardBody>
                </Card>
            </div>
            {error && <Alert color="danger">
                Erreur lors du changement des données, veuillez recharger la page et réessayer
            </Alert>}
        </Modal>


    )
}

export default ModalGame
