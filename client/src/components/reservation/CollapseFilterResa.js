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
import axios from "axios";
import token from "../../utils/token";



function CollapseFilter(props){

    const [libelle, setLibelle] = useState("");


    const [resaFilter,setResaFilter] = useState()


    useEffect(()=>{
        if(resaFilter){

        }

    },[resaFilter])


    return(
        <div>
            <Form>
                <Row>
                    <Col md="3">
                        <FormGroup>
                            <Label for="libelleFilter"> <strong>Libelle</strong> </Label>
                            <Input
                                onChange={(event)=>{setLibelle(event.target.value)}}
                                id="libelleFilter"
                                placeholder="libelle du jeu"
                                type="text"

                            />
                        </FormGroup>
                    </Col>

                </Row>

                <Row className="d-flex flex-row-reverse mr-md">
                    <Button onClick={()=>{
                        console.log("oui")}} color="secondary" type="button">
                        Filtrer
                    </Button>
                </Row>
            </Form>
        </div>
    )
}

export default CollapseFilter
