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

import React,{ useState} from "react";
import Axios from "axios";
import Waiting from "../utils/Waiting";
import token from "../../utils/token";


function CollapseFilter(props){

    const [nbJoueurState, setNbJoueurState] = useState(12);

    const handleChange = ()=>{
        console.log(document.getElementById("nbJoueur").value)
    }
    return(
        <div>
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Input
                                id="exampleFormControlInput1"
                                placeholder="libelle du jeu"
                                type="email"
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        {document.getElementById("nbJoueur") && <Label  for="nbJoueur">Nombre de joueur: {nbJoueurState}</Label>}
                        <Input min="0" max="10" onChange={(event)=> {setNbJoueurState(event.target.value)}} type="range" name="range" id="nbJoueur" />
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <InputGroup className="mb-4">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-zoom-split-in" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input placeholder="Search" type="text" />
                            </InputGroup>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <InputGroup className="mb-4">
                                <Input placeholder="Birthday" type="text" />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText>
                                        <i className="ni ni-zoom-split-in" />
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
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
