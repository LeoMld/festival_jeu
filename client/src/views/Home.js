import React from 'react'
import {Col, Container, Row} from 'reactstrap'
import home from "../assets/images/logo_FDJ_FINAL_800.png"
import useAxios from "../utils/useAxios";
import Waiting from "../components/utils/Waiting";

function Home() {

    const {data: currentFestival, setData: setCurrentFestival, isPending, error} = useAxios('/api/user/festival')

    return (
        <div className="position-relative">
            <section className="section section-lg section-shaped pb-250">
                <div className="shape shape-style-1 shape-default">
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                </div>
                <Container className="py-lg-md d-flex mt-md">
                    <div className="col px-0">
                        <Row>
                            <Col lg="7">
                                <img
                                    style={{height: "auto"}}
                                    alt="logo"
                                    className="img-fluid floating"
                                    src={home}
                                />
                            </Col>
                            {isPending ? <Waiting/> :
                                <Col className="align-middle">
                                    <h1 className="font-weight-900">{!isPending && currentFestival.nameFestival}</h1>
                                    <p className="lead font-weight-900 mb-5">
                                        Sortons jouer !
                                    </p>
                                    <p className="lead text-white">
                                        Parcourez les différents jeux présents pour ce festival !
                                    </p>
                                    <p className="lead text-white">
                                        Trier par zone, par éditeur, par nom, etc ...
                                    </p>
                                </Col>}
                        </Row>
                    </div>
                </Container>
            </section>
        </div>
    )
}

export default Home;

