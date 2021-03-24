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
import WorkFlowSelector from "../utils/WorkFlowSelector";
import Waiting from "../utils/Waiting";



function CollapseFilter(props){

    const [Etat,setEtat] = useState()
    const [nom,setNom] = useState("")

    const [resaFilter,setResaFilter] = useState()
    const [isPending,setIsPending] = useState(false)

    const [allReservations,setAllReservations] =useState(props.r)
    const handleChange = ()=>{
        setIsPending(true)
        axios.get("/api/gestion/reservations",{ headers: { Authorization: token.getToken() } })
            .then(({data}) => {
                setResaFilter(data);
                setIsPending(false)
            })
            .catch(err => {
                //if the token is not the good one
                if(err.response.data.code === 0){
                    token.destroyToken()
                }

            })
    }


    useEffect(()=>{
        if(resaFilter){
            let filter
            filter = resaFilter.filter(resa => resa.nomPersonne.includes(nom))

            props.setR(filter)
        }

    },[resaFilter])


    return(
        <div>
            <Form>
                <Row>
                    <Col md="2">
                        <FormGroup>
                            <Label for="nomFilter"> <strong>Nom de l'exposant</strong> </Label>
                            <Input
                                onChange={(event)=>{setNom (event.target.value)}}
                                id="nomFilter"
                                placeholder="Nom de l'exposant"
                                type="text"

                            />
                        </FormGroup>
                    </Col>
                    <Col md="2d">
                        <Label for="libelleFilter"> <strong>Etat de la réservation</strong> </Label>
                        <WorkFlowSelector id="libelleFilter" type={"Tous"} handleChanges={(event)=>{setEtat(event.target.value)}}/>
                    </Col>

                </Row>

                <Row className="d-flex flex-row-reverse mr-md">
                    {!isPending && <Button onClick={()=>{handleChange()}} color="secondary" type="button">
                        Filtrer
                    </Button>}
                    {isPending && <Waiting/>}
                </Row>
            </Form>
        </div>
    )
}

export default CollapseFilter
