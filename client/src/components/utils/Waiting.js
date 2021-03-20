import React from "react"
import {Badge, Col, Row, Spinner} from "reactstrap";

function Waiting(props){
    return(
        <div >
            <Col>
                <Row className="justify-content-center">
                    <Spinner color="primary" />
                </Row>
                {props.name &&
                <Row className="justify-content-center mt-md mb-md">
                    <Badge color="primary">loading {props.name}...</Badge>
                </Row>}
            </Col>
        </div>
    )
}

export default Waiting
