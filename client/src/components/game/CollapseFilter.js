import {Button, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";

import React, {useEffect, useState} from "react";
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import Waiting from "../utils/Waiting";
import axios from "axios";
import token from "../../utils/token";


function CollapseFilter(props) {

    const [nbJoueurState, setNbJoueurState] = useState({min: 0, max: 7});
    const [ageState, setAgeState] = useState({min: 1, max: 18});
    const [prototype, setPrototype] = useState(2);
    const [libelle, setLibelle] = useState("");
    const [type, setType] = useState("");
    const [isPending, setIsPending] = useState(false)


    const [gamesFilter, setGamesFilter] = useState()


    useEffect(() => {
        if (gamesFilter) {
            let filter
            if (parseInt(prototype) === 2) {
                filter = gamesFilter.filter(game => {
                    const bool = game.libelleJeu.includes(libelle)
                        && (game.ageMinimum >= ageState.min && game.ageMinimum <= ageState.max)
                        && (game.libelleTypeJeu.includes(type))
                    if (game.nombreJoueur === "7+") {
                        return (bool && (7 <= nbJoueurState.max)
                        )
                    } else {
                        return (bool && (game.nombreJoueur >= nbJoueurState.min && game.nombreJoueur <= nbJoueurState.max)
                        )
                    }
                })

                props.setGames(filter)
            } else {
                filter = gamesFilter.filter(game => {
                    const bool = game.libelleJeu.includes(libelle)
                        && (game.ageMinimum >= ageState.min && game.ageMinimum <= ageState.max)
                        && (game.prototype === (parseInt(prototype) === 0))
                        && (game.libelleTypeJeu.includes(type))
                    if (game.nombreJoueur === "7+") {
                        return (bool && (7 <= nbJoueurState.max)
                        )
                    } else {
                        return (bool && (game.nombreJoueur >= nbJoueurState.min && game.nombreJoueur <= nbJoueurState.max)
                        )
                    }
                })
                props.setGames(filter)
            }
        }

    }, [gamesFilter])

    const handleChange = () => {
        setIsPending(true)
        axios.get("/api/games", {headers: {Authorization: token.getToken()}})
            .then(({data}) => {
                setGamesFilter(data);
                setIsPending(false)
                props.setNbPagin(1)
            })
            .catch(err => {
                //if the token is not the good one

                if (err.response.data.code === 0) {
                    token.destroyToken()
                }

            })


    }
    return (
        <div>
            <Form>
                <Row>
                    <Col md="3">
                        <FormGroup>
                            <Label for="libelleFilter"> <strong>Libellé</strong> </Label>
                            <Input
                                onChange={(event) => {
                                    setLibelle(event.target.value)
                                }}
                                id="libelleFilter"
                                placeholder="Libellé du jeu"
                                type="text"

                            />
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <Label for="Type"> <strong>Type</strong> </Label>
                            <Input
                                onChange={(event) => {
                                    setType(event.target.value)
                                }}
                                id="Type"
                                placeholder="Libellé du jeu"
                                type="select"
                            >
                                <option value="">Tous</option>
                                {props.types.map((type, index) => {
                                    return (
                                        <option key={index} value={type.libelleTypeJeu}>{type.libelleTypeJeu}</option>
                                    )
                                })}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <label for="prototypeFilter"> <strong>Prototype</strong> </label>
                        <FormGroup id="prototypeFilter" tag="fieldset">
                            <FormGroup check>
                                <Label check>
                                    <Input onChange={(event) => {
                                        setPrototype(event.target.value)
                                    }} type="radio" value={0} name="radio1"/>{' '}
                                    Oui
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input onChange={(event) => {
                                        setPrototype(event.target.value)
                                    }} type="radio" value={1} name="radio1"/>{' '}
                                    Non
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input onChange={(event) => {
                                        setPrototype(event.target.value)
                                    }} type="radio" value={2} defaultChecked name="radio1"/>{' '}
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
                                <InputRange
                                    id="nbJoueurs"
                                    maxValue={7}
                                    minValue={0}
                                    value={nbJoueurState}
                                    onChange={(value) => {
                                        setNbJoueurState(value)
                                    }}/>
                            </div>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <div className="mb-sm-5">
                                <Label className="mb-sm-3" for="ageMin"> <strong> Âge minimum</strong></Label>
                                {/*{document.getElementById("nbJoueur") && <Label  for="nbJoueur">Nombre de joueur: {nbJoueurState}</Label>}
                        <Input min="0" max="10" onChange={(event)=> {setNbJoueurState(event.target.value)}} type="range" name="range" id="nbJoueur" />*/}
                                <InputRange
                                    id="ageMin"
                                    maxValue={18}
                                    minValue={2}
                                    value={ageState}
                                    onChange={(value) => {
                                        setAgeState(value)
                                    }}/>
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="d-flex flex-row-reverse mr-md">
                    {!isPending && <Button onClick={handleChange} color="secondary" type="button">
                        Filtrer
                    </Button>}
                    {isPending && <Waiting/>}
                </Row>
            </Form>
        </div>
    )
}

export default CollapseFilter
