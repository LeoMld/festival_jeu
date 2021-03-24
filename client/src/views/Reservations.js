import useAxios from "../utils/useAxios";
import {Badge, Button, Card, CardBody, Col, Row, Table, UncontrolledCollapse} from "reactstrap";
import React, {useEffect} from "react";
import Waiting from "../components/utils/Waiting";
import Reservation from "../components/reservation/reservation";
import CollapseFilterResa from "../components/reservation/CollapseFilterResa";


function Reservations() {
    const {data: reservations, setData: setReservations, isPending, error} = useAxios("/api/gestion/reservations")

    useEffect(()=>{
    },[reservations])

    return (
        <div>


            <div>

                <Row className="mb-5 mt-5">
                    <Col>
                        <h1 className="font-weight-900">Liste des Réservations</h1>
                    </Col>
                </Row>

                { reservations && !isPending && <div className="mr-md ml-md">
                    <Col  className="d-flex flex-row mb-sm-3">
                        <Button id="toggler" color="info"  type="button">
                            Filtres
                        </Button>
                    </Col>
                    <UncontrolledCollapse toggler="#toggler">
                        <Card>
                            <CardBody>
                                {reservations &&  <CollapseFilterResa resa={reservations} setResa={setReservations}/>}
                            </CardBody>
                        </Card>
                    </UncontrolledCollapse>
                    <Row className="ml-lg-9 mb-sm-3">

                    </Row>
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
                            <th>
                                Commentaires
                            </th>

                        </tr>
                        </thead>
                        <tbody>
                        {reservations.map((r,index) => {
                            return (
                                <Reservation key={index} index={index} r={r}/>
                            )
                        })}
                        </tbody>
                    </Table>
                </div>}
                {isPending && <Waiting/>}
            </div>

        </div>
    )
}
export default Reservations
