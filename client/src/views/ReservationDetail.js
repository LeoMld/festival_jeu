import useAxios from "../utils/useAxios";
import {Alert, Col, Input, Label, Row} from "reactstrap";
import Waiting from "../components/utils/Waiting";
import WorkFlowSelector from "../components/utils/WorkFlowSelector";
import axios from "axios";
import token from "../utils/token";
import {useState} from "react";

function ReservationDetail(props){
    const {data:info,setData:setInfo,isPending,err}=useAxios("/api/gestion/reservations/"+props.match.params.id)
    const [error,setError] = useState(false)
    const handleChanges = async (event)=>{
        let data={}
        let value= event.target.value
        data[event.target.id]=value
        axios.put("/api/gestion/reservations/"+info.idReservation,data,{ headers: { Authorization: token.getToken() } })
            .then((res)=>{
                setInfo({...info,[event.target.id]:value})
                setError(false)
            })
            .catch(()=>{
                setError(true)
            })
    }
    const handleSelector = async (event,val)=>{
        let data={}
        data[event.target.id]=val
        setInfo({...info,[event.target.id]:val})

        axios.put("/api/gestion/reservations/"+info.idReservation,data,{ headers: { Authorization: token.getToken() } })
            .then((res)=>{
                setInfo({...info,[event.target.id]:val})
                setError(false)
            })
            .catch(()=>{
                setError(true)
            })
    }
    return(
        <div className="container justify-content-center">
            {error && <Alert color="danger">
                Erreur lors du changement des données, veuillez recharger la page et réessayer
            </Alert>}
            <Row className="mb-5 mt-5">
                <Col>
                    <h1 className="font-weight-900">Détail de la Réservation</h1>
                </Col>
            </Row>
            {isPending && <Waiting/>}
            {info &&
                <div>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <p className="mb--1">Etat de la Réservation</p>
                            <WorkFlowSelector selected={info.workflowReservation} id="workflowReservation" handleChanges={handleChanges}/>
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
                                   value={info.datePremierContactReservation?new Date(info.datePremierContactReservation).toISOString().slice(0, 10):""}

                                   onChange={(event)=>handleChanges(event)}/>
                        </Col>
                        <Col>
                            <Label for="dateSecondContactReservation" className="mb--2">
                                Date 2nd Contact
                            </Label>
                            <Input type="date"
                                   name="dateSecondContactReservation"
                                   id="dateSecondContactReservation"
                                   value={info.dateSecondContactReservation?new Date(info.dateSecondContactReservation).toISOString().slice(0, 10):""}

                                   onChange={(event)=>handleChanges(event)}/>
                        </Col>
                    </Row>
                </div>


            }

        </div>
    )
}
export default ReservationDetail
