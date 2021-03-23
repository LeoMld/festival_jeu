import {Col, Input, Label, Row} from "reactstrap";
import WorkFlowSelector from "../utils/WorkFlowSelector";
import React, {useState} from "react";
import token from "../../utils/token";
import axios from "axios";

function Reservation(props){
    let [r,setR] = useState(props.r)
    const handleChanges = async (event)=>{
        let info={}
        let value= event.target.value
        if(value==="on"){
            value=true
        }
        if(value==="off"){
            value=false
        }
        info[event.target.id]=value
        console.log(info)
        axios.put("/api/gestion/reservations/"+r.idReservation,info,{ headers: { Authorization: token.getToken() } })
            .then((res)=>{
                setR({...r,[event.target.name]:value})
            })
            .catch(()=>{
                setR(props.r)
            })
    }
    return(
        <tr key={props.index}>
            <td>{r.nomPersonne}</td>
            <td>

                <Row>
                    <Col md={6}>
                        <p className="mb--1">Etat de la Réservation</p>
                        <WorkFlowSelector selected={r.workflowReservation} id="workflowReservation" handleChanges={handleChanges}/>
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Col>
                        <Label for="datePremierContactReservation" className="mb--2">
                            Date 1er Contact
                        </Label>
                        <Input type="date"
                               name="datePremierContactReservation"
                               id="datePremierContactReservation"
                               value={r.datePremierContactReservation?new Date(r.datePremierContactReservation).toISOString().slice(0, 10):""}

                               onChange={(event)=>handleChanges(event)}/>
                    </Col>
                    <Col>
                        <Label for="dateSecondContactReservation" className="mb--2">
                            Date 2nd Contact
                        </Label>
                        <Input type="date"
                               name="dateSecondContactReservation"
                               id="dateSecondContactReservation"
                               value={r.dateSecondContactReservation?new Date(r.dateSecondContactReservation).toISOString().slice(0, 10):""}

                               onChange={(event)=>handleChanges(event)}/>
                    </Col>
                </Row>

            </td>
            <td>
                <Row>
                    <Col>
                        <p className="mb--1">Placé:</p>
                        <label className="custom-toggle">
                            <input id="estPlaceReservation"
                                   type="checkbox"
                                   defaultChecked={r.estPlaceReservation}
                                   onChange={(event)=>handleChanges(event)}/>
                            <span className="custom-toggle-slider rounded-circle"/>
                        </label>
                    </Col>
                    <Col>
                        <p className="mb--1">Déplace:</p>
                        <label className="custom-toggle">
                            <input id="seDeplaceReservation"
                                   type="checkbox"
                                   defaultChecked={r.seDeplaceReservation}
                                   onChange={(event)=>handleChanges(event)}/>
                            <span className="custom-toggle-slider rounded-circle"/>
                        </label>
                    </Col>
                    <Col>
                        <p className="mb--1">Bénévoles:</p>
                        <label className="custom-toggle">
                            <input id="besoinAnimateurReservation"
                                   type="checkbox"
                                   defaultChecked={r.besoinAnimateurReservation}
                                   onChange={(event)=>handleChanges(event)}/>
                            <span className="custom-toggle-slider rounded-circle"/>
                        </label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Label for="dateEnvoiFactureReservation" className="mb--2">
                            Envoi Facture
                        </Label>
                        <Input type="date"
                               name="dateEnvoiFactureReservation"
                               id="dateEnvoiFactureReservation"
                               value={r.dateEnvoiFactureReservation?new Date(r.dateEnvoiFactureReservation).toISOString().slice(0, 10):""}
                               onChange={(event)=>handleChanges(event)}/>
                    </Col>
                    <Col>
                        <Label for="datePaiementFactureReservation" className="mb--2">
                            Paiement Facture
                        </Label>
                        <Input type="date"
                               name="datePaiementFactureReservation"
                               id="datePaiementFactureReservation"
                               value={r.datePaiementFactureReservation?new Date(r.datePaiementFactureReservation).toISOString().slice(0, 10):""}
                               onChange={(event)=>handleChanges(event)}/>
                    </Col>
                </Row>
            </td>
            <td>{r.prixReservation}</td>
            <td>
                <Input type="textarea">{r.textNote}</Input>
            </td>
        </tr>
    )
}
export default Reservation
