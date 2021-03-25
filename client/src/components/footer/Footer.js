import React from "react";
// reactstrap components
import {Button, Col, Container, Nav, NavItem, NavLink, Row, UncontrolledTooltip} from "reactstrap";

class Footer extends React.Component {
  render() {
    return (

        <>
          <footer className="user-select-none footer has-cards">
            <Container>
              <Row className=" row-grid align-items-center mb-5">
                <Col lg="6">
                  <h3 className=" text-primary font-weight-light mb-2">
                    Au plaisir de vous revoir avant l'année 2025 !
                  </h3>
                  <h4 className=" mb-0 font-weight-light">
                    Suivez nous sur nos différents réseaux.
                  </h4>
                </Col>
                <Col className="text-lg-center btn-wrapper" lg="6">
                  <Button
                      className="btn-icon-only rounded-circle"
                      color="twitter"
                      href=""
                      id="tooltip475038074"
                      target="_blank"
                  >
                  <span className="btn-inner--icon">
                    <i className="fa fa-twitter" />
                  </span>
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip475038074">
                    Follow us
                  </UncontrolledTooltip>
                  <Button
                      className="btn-icon-only rounded-circle ml-1"
                      color="facebook"
                      href=""
                      id="tooltip837440414"
                      target="_blank"
                  >
                  <span className="btn-inner--icon">
                    <i className="fa fa-facebook-square" />
                  </span>
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip837440414">
                    Like us
                  </UncontrolledTooltip>
                  <Button
                      className="btn-icon-only rounded-circle ml-1"
                      color="dribbble"
                      href=""
                      id="tooltip829810202"
                      target="_blank"
                  >
                  <span className="btn-inner--icon">
                    <i className="fa fa-dribbble" />
                  </span>
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip829810202">
                    Follow us
                  </UncontrolledTooltip>
                  <Button
                      className="btn-icon-only rounded-circle ml-1"
                      color="github"
                      href="https://github.com/LeoMld/festival_jeu"
                      id="tooltip495507257"
                      target="_blank"
                  >
                  <span className="btn-inner--icon">
                    <i className="fa fa-github" />
                  </span>
                  </Button>
                  <UncontrolledTooltip delay={0} target="tooltip495507257">
                    Star on Github
                  </UncontrolledTooltip>
                </Col>
              </Row>
              <hr />
              <Row className=" align-items-center justify-content-md-between">
                <Col md="6">
                  <div className=" copyright">
                    © {new Date().getFullYear()}{" "}
                    <a
                        href="https://www.polytech.umontpellier.fr/"
                        target="_blank"
                    >
                      Polytech
                    </a>
                    .
                  </div>
                </Col>
                <Col md="6">
                  <Nav className=" nav-footer justify-content-end">
                    <NavItem>
                      <Button className="mr-md" size="sm" style={{opacity:"0"}} onClick={()=>{document.getElementById("firstDiv").classList.add("fa-spin")
                        setTimeout(function (){document.getElementById("firstDiv").classList.remove("fa-spin")},2000)}}/>

                    </NavItem>
                    <NavItem>

                      <NavLink
                          href=""
                          target="_blank"
                      >
                        About Us

                      </NavLink>
                    </NavItem>


                  </Nav>
                </Col>
              </Row>
            </Container>
          </footer>
        </>
    );
  }
}

export default Footer;
