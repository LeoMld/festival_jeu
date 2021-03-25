import {Button, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";

import React, {useState} from "react";
import "react-input-range/lib/css/index.css";
import axios from "axios";
import token from "../../utils/token";
import WorkFlowSelector from "../utils/WorkFlowSelector";
import Waiting from "../utils/Waiting";


function CollapseFilter(props){

    const [Etat,setEtat] = useState(10)
    const [nom,setNom] = useState("")
    const [prixMin,setPrixMin] = useState()
    const [prixMax,setPrixMax] = useState()


    const [isPending,setIsPending] = useState(false)


    const handleChange = ()=>{
        setIsPending(true)
        axios.get("/api/gestion/reservations",{ headers: { Authorization: token.getToken() } })
            .then(({data}) => {
                let filter
                if(parseInt(Etat) !== 10){

                    filter = data.filter(resa => resa.nomPersonne.includes(nom)
                        && (parseInt(resa.workflowReservation) === parseInt(Etat))
                        && (resa.prixReservation >= (isNaN(parseInt(prixMin))? 0: parseInt(prixMin) ))
                        && (resa.prixReservation <= (isNaN(parseInt(prixMax))? Infinity: parseInt(prixMax) )))

                }else{
                    filter = data.filter(resa => resa.nomPersonne.includes(nom)
                        && (resa.prixReservation >= (isNaN(parseInt(prixMin))? 0: parseInt(prixMin) ))
                        && (resa.prixReservation <= (isNaN(parseInt(prixMax))? Infinity: parseInt(prixMax) )))


                }
                props.setResa([])
                setTimeout(function(){ props.setResa(filter) }, 1)
                setIsPending(false)
            })
            .catch(err => {
                //if the token is not the good one
                if(err.response.data.code === 0){
                    token.destroyToken()
                }

            })
    }





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
                    <Col  md="2">
                        <Label for="libelleFilter"> <strong>Etat de la réservation</strong> </Label>
                        <WorkFlowSelector onChange={(event)=>{setEtat(event.target.value)}} id="libelleFilter" type={"Tous"} handleChanges={(event)=>{setEtat(event.target.value)}}/>
                    </Col>
                    <Col className="ml-md" md="5">
                        <Label for="tranchePrix"> <strong>Tranche de prix</strong> </Label>
                        <Row  id="tranchePrix">
                            <Col md="1.5">
                                <Label for="prixMin">Min :</Label>
                            </Col>
                            <Col md="4" className="">
                                <Input id="prixMin" type="number" placeholder="Prix min" value={prixMin} onChange={(e)=>{setPrixMin(e.target.value)}}/>
                            </Col>
                            <Col md="1.5">
                                <Label for="prixMin">Max :</Label>
                            </Col>
                            <Col md="5" className="">
                                <Input id="prixMin" type="number" placeholder="Prix max" value={prixMax} onChange={(e)=>{setPrixMax(e.target.value)}}/>
                            </Col>
                        </Row>

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
