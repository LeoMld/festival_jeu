import React, {useEffect, useState} from 'react'
import NavAccount from "../components/account/NavAccount";
import useAxios from "../utils/useAxios";
import {Col, Container, Progress, Row} from "reactstrap";

function Facturation(){

    const {data:reservations,setData:setReservation,isPending,error} = useAxios("/api/gestion/Reservations")

    const [CAprevu,setCAprevu] = useState(0)
    const [CAactuel,setCAactuel] = useState(0)
    const [nbResaPrevuPayee,setnbResaPrevuPayee] = useState(0)
    const [nbResaActuelPayee,setnbResaActuelPayee] = useState(0)

    const [nbFactureEditee,setNbFactureEditee] = useState(0)
    const [nbFactureEditeePayee,setNbFactureEditeePayee] = useState(0)

    useEffect(()=>{
        if(!isPending){
            let sommePrevu = 0
            let sommePayee = 0;
            //update sum expected
            reservations.forEach(r => sommePrevu+=r.prixReservation)
            if(reservations.length>0)setnbResaPrevuPayee(reservations.length)
            setCAprevu(sommePrevu)

            //update sum paid
            const reservationsPayees = reservations.filter(reservation => reservation.payeReservation)
            reservationsPayees.forEach(r => sommePayee+= r.prixReservation)
            setnbResaActuelPayee(reservationsPayees.length)
            setCAactuel(sommePayee)

            //facture edited
            const reservationFactureEditee = reservations.filter(reservation => reservation.dateEnvoiFactureReservation !== null)
            //facture edited and paid
            const reservationFactureEditeePayee = reservations.filter(reservation => reservation.payeReservation)

            if(reservationFactureEditee.length>0)setNbFactureEditee(reservationFactureEditee.length)
            setNbFactureEditeePayee(reservationFactureEditeePayee.length)

        }
    },[reservations,isPending])

    return(
        <Container className="container justify-content-center mt-md" style={{minHeight : "500px"}}>
            <h1 className="mb-md font-weight-800">Facturation</h1>
            <hr/>
            <Row>
                <Col className="mr-md">
                    <h3 className="font-weight-600">Paiements</h3>

                    <Row className="mb-sm-3 mt-sm-4">
                        CA prévu : {CAprevu} €
                    </Row>
                    <Row>
                        CA actuel : {CAactuel} €
                    </Row>


                    <div className="progress-wrapper mt-md">
                        <div className="progress-info">
                            <div className="progress-label">
                                <span style={{fontSize:"12px"}}>Pourcentage du CA prévu / CA espéré</span>
                            </div>
                            <div className="progress-percentage">
                                <span>{CAprevu !== 0 ? Math.round(CAactuel/CAprevu*100) : 0}%</span>
                            </div>
                        </div>
                        <Progress max="100" value={CAprevu !== 0 ? CAactuel/CAprevu*100 : 0} />
                    </div>



                    <div className="progress-wrapper">
                        <div className="progress-info">
                            <div className="progress-label">
                                <span style={{fontSize:"12px"}}>Pourcentage des exposants dont la facture a été éditée et qui ont payé</span>
                            </div>
                            <div className="progress-percentage">
                                <span>{nbFactureEditee !== 0 ? Math.round(nbFactureEditeePayee/nbFactureEditee*100) : 0}%</span>
                            </div>
                        </div>
                        <Progress max="100" value={nbFactureEditee !== 0 ? nbFactureEditeePayee/nbFactureEditee*100 : 0} />
                    </div>
                </Col>
                <hr className="hr-vertical"/>
                <Col className="ml-md">
                    <h3 className="font-weight-600">Réservations</h3>

                    <Row className="mt-md">Nombre total de réservation : {nbResaPrevuPayee}</Row>

                    <div className="progress-wrapper mt-md">
                        <div className="progress-info">
                            <div className="progress-label">
                                <span style={{fontSize:"12px"}}>Pourcentage des réservations payées</span>
                            </div>
                            <div className="progress-percentage">
                                <span>{nbResaPrevuPayee !== 0 ? Math.round(nbResaActuelPayee/nbResaPrevuPayee*100) : 0}%</span>
                            </div>
                        </div>
                        <Progress max="100" value={nbResaPrevuPayee !== 0 ? nbResaActuelPayee/nbResaPrevuPayee*100 : 0} />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Facturation;
