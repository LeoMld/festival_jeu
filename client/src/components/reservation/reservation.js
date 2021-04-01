import {Button, Col, Input, Label, Row} from "reactstrap";
import WorkFlowSelector from "../utils/WorkFlowSelector";
import React, {useEffect, useState} from "react";
import token from "../../utils/token";
import axios from "axios";
import {Link} from "react-router-dom";

function Reservation(props){
    let tokenType = token.getType()
    let [r,setR] = useState(props.r)
    let [color,setColor] = useState(r.workflowReservation)
    let [textNote,setTextNote] = useState("")
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


    useEffect(()=>{
        setR(props.r)
        setColor(parseInt(props.r.workflowReservation))
        setTextNote(props.r.textNote)
        if(token.getType()===1){
            document.getElementById("textNote"+(props.index+(props.nbPagin-1)*5)).value = props.r.textNote
        }
    },[props.r])

    useEffect(()=>{
        if(props.nbPagin){
            if(r !== props.r){
                setColor(parseInt(r.workflowReservation))
                let newResas = [...props.reservations]
                newResas[(props.index+(props.nbPagin-1)*5)] = r
                props.setReservations(newResas)
            }
        }else{
            let newResas = [...props.reservations.reservations]
            newResas[props.index] = r
            props.setReservations({...props.reservations,reservations:newResas})
        }
    },[r])



    const handleChanges = async (event)=>{
        let info={}
        let value= event.target.value
        info[event.target.id]=value
        axios.put("/api/gestion/reservations/"+r.idReservation,info,{ headers: { Authorization: token.getToken() } })
            .then((res)=>{
                if(event.target.id==="workflowReservation"){
                    setColor(parseInt(value))
                    setR({...r,[event.target.id]:value})
                }
                else{
                    setR({...r,[event.target.name]:value})
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

        axios.put("/api/gestion/reservations/"+r.idReservation,info,{ headers: { Authorization: token.getToken() } })
            .then((res)=>{
                setR({...r,[event.target.id]:val})
            })
            .catch(()=>{
                setR(props.r)
            })
    }
    const handleEditNote = async (event)=>{
        let valeur = textNote
        let info = {textNote : valeur}
        if(r.idNote!==null){
            info["idNote"]=r.idNote
            axios.put("/api/gestion/notes/"+r.idNote,info,{ headers: { Authorization: token.getToken() }})
                .then((res)=>{
                    setR({...r,textNote:valeur})
                })
                .catch(()=>{
                    setR(props.r)
                })
        }else{
            info["idReservation"]=r.idReservation
            axios.post("/api/gestion/notes",info,{ headers: { Authorization: token.getToken() }})
            .then((res)=>{
                let rBis = {...r}
                rBis.textNote = valeur
                rBis.idNote = res.data.idNote
                setR(rBis)
            })
            .catch(()=>{
                setR(props.r)
            })
        }
    }
    const badLuck = ()=>{
        console.log("Nice Try")
    }
    return(
        <tr key={props.index}>
            {props.type===1 &&
            <td>
                <Row className="justify-content-center">
                    {r.nameFestival}
                </Row>
                <Row className="justify-content-center mt-5">
                    <Link to={"/Reservations/"+r.idReservation} className="btn btn-default">Voir</Link>
                </Row>

            </td>
            }
            {props.type!==1 &&
            <td>
                <Row className="justify-content-center">
                    {r.nomPersonne}

                </Row>
                <Row className="justify-content-center mt-5">
                    <Link to={"/Reservations/"+r.idReservation} className="btn btn-default">Voir</Link>

                </Row>
            </td>}

            <td>

                <Row>
                    <Col md={6}>
                        <p className="mb--1">Etat de la Réservation</p>
                        <WorkFlowSelector selected={props.r.workflowReservation} id="workflowReservation" handleChanges={tokenType === 1 ? handleChanges : badLuck} disabled={token.getType() !== 1}/>
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
                               disabled={token.getType()!==1}
                               onChange={tokenType===1?(event)=>handleChanges(event):badLuck}/>
                    </Col>
                    <Col>
                        <Label for="dateSecondContactReservation" className="mb--2">
                            Date 2nd Contact
                        </Label>
                        <Input type="date"
                               name="dateSecondContactReservation"
                               id="dateSecondContactReservation"
                               value={r.dateSecondContactReservation?new Date(r.dateSecondContactReservation).toISOString().slice(0, 10):""}
                                disabled={token.getType()!==1}
                               onChange={tokenType===1?(event)=>handleChanges(event):badLuck}/>
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
                                   onChange={tokenType===1?(event)=>handleSelector(event,!(r.estPlaceReservation)):badLuck}
                                   disabled={token.getType()!==1}
                            />
                            <span className="custom-toggle-slider rounded-circle"/>
                        </label>
                    </Col>
                    <Col>
                        <p className="mb--1">Déplace:</p>
                        <label className="custom-toggle">
                            <input id="seDeplaceReservation"
                                   type="checkbox"
                                   checked={r.seDeplaceReservation}
                                   onChange={tokenType===1?(event)=>handleSelector(event,!r.seDeplaceReservation):badLuck}
                                   disabled={token.getType()!==1}
                            />
                            <span className="custom-toggle-slider rounded-circle"/>
                        </label>
                    </Col>
                    <Col>
                        <p className="mb--1">Bénévoles:</p>
                        <label className="custom-toggle">
                            <input id="besoinAnimateurReservation"
                                   type="checkbox"
                                   checked={r.besoinAnimateurReservation}
                                   onChange={tokenType===1?(event)=>handleSelector(event,!(r.besoinAnimateurReservation)):badLuck}
                                   disabled={token.getType()!==1}
                            />
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
                               onChange={tokenType===1?(event)=>handleChanges(event):badLuck}
                               disabled={token.getType()!==1}
                        />
                    </Col>
                    <Col>
                        <Label for="datePaiementFactureReservation" className="mb--2">
                            Paiement Facture
                        </Label>
                        <Input type="date"
                               name="datePaiementFactureReservation"
                               id="datePaiementFactureReservation"
                               value={r.datePaiementFactureReservation?new Date(r.datePaiementFactureReservation).toISOString().slice(0, 10):""}
                               onChange={tokenType===1?(event)=>handleChanges(event):badLuck}
                               disabled={token.getType()!==1}
                        />
                    </Col>
                </Row>
            </td>
            <td><Col >
                <Row className="justify-content-center">
                    {r.prixReservation}

                </Row>
            </Col></td>
            {token.getType()===1 && <td>
                <Input
                    type="textarea"
                    id={"textNote"+(props.index+(props.nbPagin-1)*5)}
                    value={textNote}
                    onChange={(event)=>{
                        setTextNote(event.target.value)
                    }}
                />
                  <Button className=" mt-2" color="secondary" size="sm" onClick={(event)=>handleEditNote(event)}>Valider Commentaire</Button>
            </td>}
        </tr>
    )
}
export default Reservation
