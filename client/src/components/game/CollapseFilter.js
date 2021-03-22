import {
    Button,
    Modal,
    CardBody,
    Row,
    Col,
    Form,
    FormGroup,
    InputGroup,
    Card,
    CardHeader,
    InputGroupAddon,
    Input,
    InputGroupText,
    Label,
    Alert
} from "reactstrap";

import React,{useEffect, useState} from "react";
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import Waiting from "../utils/Waiting";
import useAxios from "../../utils/useAxios";
import axios from "axios";
import token from "../../utils/token";



function CollapseFilter(props){

    const [nbJoueurState, setNbJoueurState] = useState({ min: 0, max: 10 });
    const [ageState, setAgeState] = useState({ min: 2, max: 18 });
    const [prototype, setPrototype] = useState(2);
    const [libelle, setLibelle] = useState("");

    /*const {data: games, setData: setGames, isPending, error} = useAxios("/api/games")*/
    const [gamesFilter,setGamesFilter] = useState()


    useEffect(()=>{
        if(gamesFilter){
            let filter
            if(prototype === 2){
                filter = gamesFilter.filter(game => game.libelleJeu.includes(libelle)
                    && (game.nombreJoueur>=nbJoueurState.min && game.nombreJoueur<=nbJoueurState.max)
                    && (game.ageMinimum>=ageState.min && game.ageMinimum<=ageState.max))
                props.setGames(filter)
            }else{
                filter = gamesFilter.filter(game => game.libelleJeu.includes(libelle)
                    && (game.nombreJoueur>=nbJoueurState.min && game.nombreJoueur<=nbJoueurState.max)
                    && (game.ageMinimum>=ageState.min && game.ageMinimum<=ageState.max)
                    && (game.prototype === (parseInt(prototype)===0)))
                props.setGames(filter)
            }
        }

    },[gamesFilter])

    const handleChange = ()=>{
        axios.get("/api/games",{ headers: { Authorization: token.getToken() } })
            .then(({data}) => {
                setGamesFilter(data);
            })
            .catch(err => {
                //if the token is not the good one

                if(err.response.data.code === 0){
                    token.destroyToken()
                }

            })




        /*&& (game.prototype === (prototype===2))*/


    }
    return(
        <div>
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Label for="libelle"> <strong>Libelle</strong> </Label>
                            <Input
                                onChange={(event)=>{setLibelle(event.target.value)}}
                                id="libelle"
                                placeholder="libelle du jeu"
                                type="email"

                            />
                        </FormGroup>
                    </Col>
                    <Col  md="6">
                        <label for="prototype"> <strong>Prototype</strong> </label>
                        <FormGroup id="prototype" tag="fieldset">
                            <FormGroup check>
                                <Label check>
                                    <Input onChange={(event)=>{setPrototype(event.target.value)}} type="radio" value={0}  name="radio1" />{' '}
                                    Oui
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input onChange={(event)=>{setPrototype(event.target.value)}} type="radio" value={1} name="radio1" />{' '}
                                    Non
                                </Label>
                            </FormGroup>
                            <FormGroup check >
                                <Label check>
                                    <Input onChange={(event)=>{setPrototype(event.target.value)}} type="radio" value={2} defaultChecked name="radio1" />{' '}
                                    Tous
                                </Label>
                            </FormGroup>
                        </FormGroup>

                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <div className="mb-sm-5">
                                <Label className="mb-sm-3" for="nbJoueurs"> <strong>nombre de joueurs</strong> </Label>
                                {/*{document.getElementById("nbJoueur") && <Label  for="nbJoueur">Nombre de joueur: {nbJoueurState}</Label>}
                        <Input min="0" max="10" onChange={(event)=> {setNbJoueurState(event.target.value)}} type="range" name="range" id="nbJoueur" />*/}
                                <InputRange
                                    id="nbJoueurs"
                                    maxValue={10}
                                    minValue={0}
                                    value={nbJoueurState}
                                    onChange={(value) => {setNbJoueurState(value)}} />
                            </div>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <div className="mb-sm-5">
                                <Label className="mb-sm-3" for="nbJoueurs"> <strong> Âge minimum</strong></Label>
                                {/*{document.getElementById("nbJoueur") && <Label  for="nbJoueur">Nombre de joueur: {nbJoueurState}</Label>}
                        <Input min="0" max="10" onChange={(event)=> {setNbJoueurState(event.target.value)}} type="range" name="range" id="nbJoueur" />*/}
                                <InputRange
                                    id="nbJoueurs"
                                    maxValue={18}
                                    minValue={2}
                                    value={ageState}
                                    onChange={(value) => {setAgeState(value)}} />
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="d-flex flex-row-reverse mr-md">
                    <Button onClick={handleChange} color="secondary" type="button">
                        Filtrer
                    </Button>
                </Row>
            </Form>
        </div>
    )
}

export default CollapseFilter
