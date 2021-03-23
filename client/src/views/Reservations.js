import useAxios from "../utils/useAxios";
import {Button, Col, Input, Label, Row, Table} from "reactstrap";
import CreatePerson from "../components/person/createPerson";
import React from "react";
import Selector from "../components/utils/Selector";
import WorkFlowSelector from "../components/utils/WorkFlowSelector";
import Waiting from "../components/utils/Waiting";
import Reservation from "../components/reservation/reservation";


function Reservations() {
    const {data: reservations, setData: setReservations, isPending, error} = useAxios("/api/gestion/reservations")

    return (
        <div>
            {isPending && <Waiting/>}
            {reservations &&
            <div>

                <Row className="mb-5 mt-5">
                    <Col>
                        <h1 className="font-weight-900">Liste des Réservations</h1>
                    </Col>
                </Row>
                <div>
                    <Table className="table-striped table-bordered table-responsive-sm">
                        <thead>
                        <tr>
                            <th>
                                Exposant
                            </th>
                            <th colSpan={2}>
                                Suivi des échanges
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
                </div>
            </div>}
        </div>
    )
}
export default Reservations
