import React, {Component} from "react";
import {Link} from "react-router-dom";

import Headroom from "headroom.js";
import token from "../../utils/token"

import {
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    Row,
    UncontrolledCollapse,
    UncontrolledDropdown,
} from "reactstrap";
import logo from "../../assets/images/LogoFJM-couleur-seul.png";

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.deconnexion = this.deconnexion.bind(this);
    }

    componentDidMount() {
        let headroom = new Headroom(document.getElementById("navbar-main"));
        headroom.init();
    }

    state = {
        collapseClasses: "",
        collapseOpen: false
    };

    onExiting = () => {
        this.setState({
            collapseClasses: "collapsing-out"
        });
    };

    onExited = () => {

        this.setState({
            collapseClasses: ""
        });
    };

    deconnexion() {
        token.destroyToken()
        this.props.history.push('/Connexion')
        window.location.reload(false);
    };

    render() {
        //return the navbar for an administrator
        if (token.getType() === 1 || token.getType() === 0) {
            return (
                <Navbar
                    className="navbar-main navbar-transparent navbar-light headroom"
                    expand="lg"
                    id="navbar-main"
                >
                    <Container>
                        <NavbarBrand className="mr-lg-5" to="/" tag={Link}>
                            <img style={{maxHeight: "40%"}} src={logo} alt="logo du festival"/>
                        </NavbarBrand>
                        <button className="navbar-toggler" id="navbar_global">
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <UncontrolledCollapse
                            toggler="#navbar_global"
                            navbar
                            className={this.state.collapseClasses}
                            onExiting={this.onExiting}
                            onExited={this.onExited}
                        >
                            <div className="navbar-collapse-header">
                                <Row>
                                    <Col className="collapse-brand" xs="6">
                                        <Link to="/">
                                        </Link>
                                    </Col>
                                    <Col className="collapse-close" xs="6">
                                        <button className="navbar-toggler" id="navbar_global">
                                            <span/>
                                            <span/>
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                            <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                                <NavItem>
                                    <Link className="nav-link" to="/ChoixFestival">Festivals</Link>
                                </NavItem>
                                <UncontrolledDropdown nav>
                                    <DropdownToggle nav>
                                        <i className="ni ni-collection d-lg-none mr-1"/>
                                        <span className="nav-link-inner--text">Gestion</span>
                                    </DropdownToggle>

                                    <DropdownMenu>
                                        <DropdownItem to="/Editeurs" tag={Link}>
                                            Editeurs
                                        </DropdownItem>
                                        <DropdownItem to="/Exposants" tag={Link}>
                                            Exposants
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                <NavItem>
                                    <Link className="nav-link" to="/ListeJeux">Liste des jeux</Link>
                                </NavItem>

                                <NavItem>
                                    <Link className="nav-link" to="/Reservations">Réservations</Link>
                                </NavItem><NavItem>
                                <Link className="nav-link" to="/Facturation">Facturation</Link>
                            </NavItem><NavItem>
                                <Link className="nav-link" to="/Zones">Zones</Link>
                            </NavItem>

                            </Nav>

                            <Nav className="align-items-lg-center ml-lg-auto" navbar>

                                <NavItem>
                                    <Link className="nav-link" to="/compte"> <i className="ni ni-circle-08"/>
                                        Mon compte</Link>
                                </NavItem>
                                <NavItem>
                                    <Link onClick={() => {
                                        this.deconnexion()
                                    }} className="nav-link" to="/"> <i className="ni ni-button-power text-red"/>
                                    </Link>
                                </NavItem>

                            </Nav>
                        </UncontrolledCollapse>
                    </Container>
                </Navbar>


            );
        } else {
            //return the navbar for a visitor

            return (
                <Navbar

                    className="navbar-main navbar-transparent navbar-light headroom"
                    expand="lg"
                    id="navbar-main"
                >
                    <Container>
                        <NavbarBrand className="mr-lg-5" to="/" tag={Link}>
                            <img style={{maxHeight: "40%"}} src={logo} alt="logo du festival"/>
                        </NavbarBrand>
                        <button className="navbar-toggler" id="navbar_global">
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <UncontrolledCollapse
                            toggler="#navbar_global"
                            navbar
                            className={this.state.collapseClasses}
                            onExiting={this.onExiting}
                            onExited={this.onExited}
                        >
                            <div className="navbar-collapse-header">
                                <Row>
                                    <Col className="collapse-brand" xs="6">
                                        <Link to="/">
                                        </Link>
                                    </Col>
                                    <Col className="collapse-close" xs="6">
                                        <button className="navbar-toggler" id="navbar_global">
                                            <span/>
                                            <span/>
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                            <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                                <NavItem>
                                    <Link className="nav-link" to="/ListeJeux">Liste des jeux</Link>
                                </NavItem>

                                <NavItem>
                                    <Link className="nav-link" to="/Zones">Zones</Link>
                                </NavItem>

                                <NavItem>
                                    <Link className="nav-link" to="/JeuxEditeurs">Editeurs</Link>
                                </NavItem>

                            </Nav>
                            <Nav className="align-items-lg-center ml-lg-auto" navbar>

                                <NavItem>
                                    <Link className="nav-link" to="/Connexion">
                                        Se connecter</Link>
                                </NavItem>


                            </Nav>


                        </UncontrolledCollapse>
                    </Container>
                </Navbar>

            );
        }


    }
}

export default Navigation;
