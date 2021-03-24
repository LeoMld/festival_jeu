import {Col, Input, Label, Row, Button} from "reactstrap";
import WorkFlowSelector from "../utils/WorkFlowSelector";
import React, {useEffect, useState} from "react";
import token from "../../utils/token";
import axios from "axios";
import pdf from "../../utils/pdf"
import {Link} from "react-router-dom";

function Reservation(props){
    let [r,setR] = useState(props.r)
    let [color,setColor] = useState(r.workflowReservation)
    const colorStateReservation = () =>{
        switch(color) {
            case 3:
                return "bg-translucent-warning"
            case 5:
            case 6:
            case 7:
                return "bg-translucent-success"
            case 8:
            case 9 :
                return "bg-red"
            default:
                return ""
        }
    }
    const handleChanges = async (event)=>{
        let info={}
        let value= event.target.value
        info[event.target.id]=value
        console.log(info)
        axios.put("/api/gestion/reservations/"+r.idReservation,info,{ headers: { Authorization: token.getToken() } })
            .then((res)=>{
                setR({...r,[event.target.name]:value})
                if(event.target.id==="workflowReservation"){
                    setColor(parseInt(value))
                }
            })
            .catch(()=>{
                setR(props.r)
            })
    }
    const handleSelector = async (event,val)=>{
        let info={}
        info[event.target.id]=val
        setR({...r,[event.target.id]:val})

        console.log(info)
        axios.put("/api/gestion/reservations/"+r.idReservation,info,{ headers: { Authorization: token.getToken() } })
            .then((res)=>{
                setR({...r,[event.target.id]:val})
            })
            .catch(()=>{
                setR(props.r)
            })
    }
    const handleEditNote = async (event)=>{
        let value = document.getElementById("textNote").value
        let info = {textNote : value}
        if(r.idNote!==null){
            info["idNote"]=r.idNote
            axios.put("/api/gestion/notes/"+r.idNote,info,{ headers: { Authorization: token.getToken() }})
                .then((res)=>{
                    setR({...r,textNote:value})
                })
                .catch(()=>{
                    setR(props.r)
                })
        }else{
            info["idReservation"]=r.idReservation
            console.log(info)
            axios.post("/api/gestion/notes",info,{ headers: { Authorization: token.getToken() }})
            .then((res)=>{
                setR({...r,textNote:value})
                setR({...r,idNote:res.data.idNote})
            })
            .catch(()=>{
                setR(props.r)
            })
        }
    }
    return(
        <tr key={props.index}>
            <td>
                <Row className="justify-content-center">
                    {r.nomPersonne}
                </Row>
                <Row className="justify-content-center mt-5">
                    <Link to={"/Reservations/"+r.idReservation} className="btn btn-default">Voir</Link>

                </Row>
            </td>
            <td>

                <Row>
                    <Col md={6}>
                        <p className="mb--1">Etat de la Réservation</p>
                        <WorkFlowSelector selected={r.workflowReservation} id="workflowReservation" handleChanges={handleChanges}/>
                    </Col>
                    <Col md={6}>
                        <div className={colorStateReservation()+ " mt-4"} style={{minHeight:"15px"}}> </div>
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
                                   checked={r.estPlaceReservation}
                                   onChange={(event)=>handleSelector(event,!(r.estPlaceReservation))}/>
                            <span className="custom-toggle-slider rounded-circle"/>
                        </label>
                    </Col>
                    <Col>
                        <p className="mb--1">Déplace:</p>
                        <label className="custom-toggle">
                            <input id="seDeplaceReservation"
                                   type="checkbox"
                                   checked={r.seDeplaceReservation}
                                   onChange={(event)=>handleSelector(event,!r.seDeplaceReservation)}/>
                            <span className="custom-toggle-slider rounded-circle"/>
                        </label>
                    </Col>
                    <Col>
                        <p className="mb--1">Bénévoles:</p>
                        <label className="custom-toggle">
                            <input id="besoinAnimateurReservation"
                                   type="checkbox"
                                   checked={r.besoinAnimateurReservation}
                                   onChange={(event)=>handleSelector(event,!(r.besoinAnimateurReservation))}/>
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
            <td><Col >
                <Row className="justify-content-center">
                    {r.prixReservation}

                </Row>
                <Row className="justify-content-center mt-md">
                    <Button onClick={()=>{pdf.createPDF(r)}}  className="btn-icon btn-3" color="danger"  type="button">
                              <span className="btn-inner--icon">
                                <i className="ni ni-paper-diploma" />
                              </span>
                        <span className="btn-inner--text">Facture</span>
                    </Button>
                </Row>
            </Col></td>
            <td>
                <Input type="textarea" id="textNote" defaultValue={r.textNote}/>
                <Button className=" mt-2" color="secondary" size="sm" onClick={(event)=>handleEditNote(event)}>Valider Commentaire</Button>
            </td>
        </tr>
    )
}
export default Reservation
