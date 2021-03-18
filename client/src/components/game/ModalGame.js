import {
    Button,
    Modal,
    CardBody,
    Form,
    FormGroup,
    InputGroup,
    Card,
    CardHeader,
    InputGroupAddon,
    Input,
    InputGroupText,
    Label
} from "reactstrap";
import React,{useEffect, useState} from "react";
import Axios from "axios";
import Waiting from "../utils/Waiting";


function ModalGame(props){

    //
    const localGame = {}



    const [isChanging, setIsChanging] = useState(false)
    const [error, setError] = useState(false)


    const handleChange = (game)=>{
        setIsChanging(true)

        props.game.libelleJeu = localGame.libelleJeu
        props.game.duree = localGame.duree
        props.game.nombreJoueur = localGame.nombreJoueur
        props.game.ageMinimum = localGame.ageMinimum

        Axios.put('/api/game/changeGame', {game})
            .then(res => {
                props.setModalState(!props.modalState)

            }).catch(e => {
                console.log("OK CA MARCHE PAS")
        })
        setIsChanging(false)


    }


    return(

        <Modal
            className="modal-dialog-centered"
            size="lg"
            isOpen={props.modalState}
            toggle={() => props.setModalState(!props.modalState)}
        >
            {!isChanging && <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-transparent pb-5">
                        <div className="text-muted text-center mt-2 mb-3">
                            <h3>Modifier le jeu</h3>
                        </div>
                    </CardHeader>
                    <CardBody  className="px-lg-5 py-lg-5">
                        {props.game != null && <Form role="form">
                            <FormGroup className="mb-3">
                                <Label for="libelle">Libelle du jeu</Label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-app" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input id="libelle" onChange={e=>{localGame.libelleJeu = e.target.value}} defaultValue={props.game.libelleJeu} placeholder="libelle du Jeu" type="text" />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <Label for="nombreJoueur">nombreJoueur</Label>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-single-02" />
                                        </InputGroupText>
                                    </InputGroupAddon>

                                    <Input onChange={e=>{localGame.nombreJoueur = e.target.value}} id="nombreJoueur" type="select" defaultValue={props.game.nombreJoueur}  name="select" >
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
                                            <i className="ni ni-badge" />
                                        </InputGroupText>
                                    </InputGroupAddon>

                                    <Input onChange={e=>{localGame.ageMinimum = e.target.value}} id="age" type="select" defaultValue={props.game.ageMinimum}  name="select" >
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

                                    <Input onChange={e=>{localGame.duree = e.target.value}} defaultValue={props.game.duree} id="duree" placeholder="durée" type="text" />
                                </InputGroup>
                            </FormGroup>

                            <div className="text-center">
                                <Button
                                    onClick={()=>{handleChange(props.game)}}
                                    className="my-4"
                                    color="primary"
                                    type="button"
                                >
                                    Valider les changements
                                </Button>
                            </div>
                        </Form>}
                    </CardBody>
                </Card>
            </div>}
            {isChanging && <Waiting className="mt-md" name={"Change"} />}
        </Modal>




    )
}

export default ModalGame
