import React from 'react'
import {Col, Container, Row} from 'reactstrap'
import home from "../assets/images/accueil/home.png"

function Home(){
    return(
        <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped pb-250">
                <div className="shape shape-style-1 shape-default">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <Container className="py-lg-md d-flex mt-md">
                    <div className="col px-0">
                        <Row>
                            <Col lg="7">
                                <img
                                    style={{height : "auto"}}
                                    alt="logo"
                                    className="img-fluid floating"
                                    src={home}
                                />
                            </Col>
                            <Col >
                                <h1 className="font-weight-900">
                                    {" "}
                                    <span>Festival du jeu</span>
                                </h1>
                                <h1 className="font-weight-600">Montpellier</h1>
                                <p className="lead text-white">
                                    Pellentesque habitant morbi tristique senectus et
                                    netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
                                    vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
                                    egestas semper. Aenean ultricies mi vitae est.
                                </p>

                            </Col>

                        </Row>
                    </div>
                </Container>
                {/* SVG separator */}
                <div className="separator separator-bottom separator-skew">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox="0 0 2560 100"
                        x="0"
                        y="0"
                    >
                        <polygon
                            className="fill-white"
                            points="2560 0 2560 100 0 100"
                        />
                    </svg>
                </div>
            </section>
            {/* 1st Hero Variation */}
        </div>




    )
}

export default Home;

