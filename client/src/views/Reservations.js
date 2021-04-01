import useAxios from "../utils/useAxios";
import {Alert, Badge, Button, Card, CardBody, Col, Row, Table, UncontrolledCollapse} from "reactstrap";
import React, {useEffect, useState} from "react";
import Waiting from "../components/utils/Waiting";
import Reservation from "../components/reservation/reservation";
import CollapseFilterResa from "../components/reservation/CollapseFilterResa";
import token from "../utils/token";
import axios from "axios";
import Pagination from "react-js-pagination";


function Reservations() {
    const {data: reservations, setData: setReservations, isPending, error} = useAxios("/api/gestion/reservations")
    const [errorReservation,setErrorReservation] = useState(false)
    const [noMoreToAdd,setNoMoreToAdd] = useState(false)
    const [added,setAdded] = useState(false)
    const [updated,setUpdated] = useState(false)
    const [numberUpdated,setNumberUpdated] = useState(0)
    const [nbPagin, setNbPagin] = useState(1)
    const [reservationsToDisplay, setReservationsToDisplay] = useState([])

    useEffect(()=>{
        if(reservations){
            const indexDebut = (nbPagin-1)*5
            const indexFin = (reservations.length <= nbPagin*5-1) ? reservations.length: nbPagin*5
            let reservationsPage = []
            for(let i = indexDebut; i<indexFin; i++){
                reservationsPage.push(reservations[i])
            }
            setReservationsToDisplay(reservationsPage)
        }

    },[nbPagin,reservations])

    const createNewReservations = ()=>{
        axios.post("/api/gestion/reservations",{},{ headers: { Authorization: token.getToken() } })
            .then((res)=>{
                if(res.data.length>0){
                    setReservations(res.data)
                    setAdded(true)

                }else{
                    setNoMoreToAdd(true)
                }
            })
            .catch(()=>{
                setErrorReservation(true)
            })
    }

    const updateNonResponseReservations = ()=>{
        axios.put("/api/gestion/reservations",{},{ headers: { Authorization: token.getToken() } })
            .then(async (res)=>{
                setReservations([])
                axios.get("/api/gestion/reservations",{ headers: { Authorization: token.getToken() } })
                    .then((result)=>{
                        setReservations(result.data)
                        setUpdated(true)
                        setNumberUpdated(res.data)
                    })
                setReservations(changeSelectorToNonResponse())
            })
    }
    const changeSelectorToNonResponse = () =>{
        let newReserv = [...reservations]
        newReserv.forEach(reserv => {
            if(reserv.workflowReservation === 2){
                reserv.workflowReservation = 3
            }
        })
        return newReserv
    }

    return (
        <div>
            <div>

                <Row className="mb-5 mt-5">
                    <Col>
                        <h1 className="font-weight-900">Liste des Réservations</h1>
                    </Col>
                </Row>

                { reservations && !isPending && <div className="mr-md ml-md">
                    {added && <Alert color="warning" toggle={()=>{setAdded(false)}}> Réservations ajoutées</Alert>}
                    {updated && <Alert color="primary" toggle={()=>{setUpdated(false)}}> {numberUpdated +" Réservation(s) modifiée(s)"}</Alert>}
                    {errorReservation && <Alert color="danger" toggle={()=>{setErrorReservation(false)}}> Erreurs lors de la créations des réservations</Alert>}
                    {noMoreToAdd && <Alert color="warning" toggle={()=>{setNoMoreToAdd(false)}}> Tous les exposants ont déjà une réservation</Alert>}
                    <Row className="d-flex justify-content-between">

                        <Col  className="d-flex flex-row mb-sm-3">
                            <Button id="toggler" color="info"  type="button">
                                Filtres
                            </Button>
                        </Col>
                        {token.getType() &&
                        <Col className="d-flex flex-row mb-sm-3">
                            <Button  type="button" color="info" onClick={updateNonResponseReservations}>
                                Trier sans réponses
                            </Button>
                        </Col>
                        }


                        {token.getType()===1 && <Col  className="d-flex flex-row mb-sm-3">
                            <Button  type="button" color="info" onClick={createNewReservations}>
                                Rafraichir les Reservations
                            </Button>
                        </Col>}


                    </Row>
                    <UncontrolledCollapse toggler="#toggler" className="mb-sm-3">
                        <Card>
                            <CardBody>
                                {reservations &&  <CollapseFilterResa setNbPagin={setNbPagin} resa={reservations} setResa={setReservations}/>}
                            </CardBody>
                        </Card>
                    </UncontrolledCollapse>
                    <Table className="table-striped table-bordered table-responsive-sm">
                        <thead>
                        <tr>
                            <th>
                                Exposant
                            </th>
                            <th colSpan={2}>

                                Suivi des échanges
                                <div className="user-select-none justify-content-start ">
                                    <Badge className="mr-sm-3" color="success">Présent</Badge>
                                    <Badge className="mr-sm-3" color="warning">Présence non confirmée</Badge>
                                    <Badge color="danger">Absent</Badge>
                                </div>
                            </th>
                            <th>
                                Prix (€)
                            </th>
                            {token.getType()===1 && <th>
                                Commentaires
                            </th>}

                        </tr>
                        </thead>
                        <tbody>
                        {reservationsToDisplay.map((r,index) => {
                            return (
                                <Reservation nbPagin={nbPagin} reservations={reservations} setReservations={setReservations} key={index} index={index} r={r}/>
                            )
                        })}
                        </tbody>
                    </Table>
                </div>}
                {isPending && <Waiting/>}
            </div>
            {reservations && <Row className="justify-content-center mt-md">
                <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={nbPagin}
                    itemsCountPerPage={5}
                    totalItemsCount={reservations.length}
                    pageRangeDisplayed={5}
                    onChange={(pageNumber)=>{setNbPagin(pageNumber)}}
                    getPageUrl={(nb) => {
                        return nb
                    }}
                />
            </Row>}
        </div>
    )
}

export default Reservations;
