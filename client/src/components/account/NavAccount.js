import React, {useState} from "react";
import classnames from "classnames";
import ProfilePane from "./ProfilePane";
import ParamPane from "./ParamPane";

// reactstrap components
import {Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import token from "../../utils/token";

function NavAccount(){

    const [tabs, setTabs] = useState(1)

    const toggleNavs = (e, index) => {
        e.preventDefault();
        setTabs(index)
    };
    return (
        <>
            <div className="nav-wrapper">
                <Nav
                    className="nav-fill flex-column flex-md-row"
                    id="tabs-icons-text"
                    pills
                    role="tablist"
                >
                    <NavItem>
                        <NavLink
                            aria-selected={tabs === 1}
                            className={classnames("mb-sm-3 mb-md-0", {
                                active: tabs === 1
                            })}
                            onClick={e => toggleNavs(e, 1)}
                            href="#profil"
                            role="tab"
                        >
                            <i className="ni ni-circle-08 mr-2" />
                            Profil
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            aria-selected={tabs === 2}
                            className={classnames("mb-sm-3 mb-md-0", {
                                active: tabs === 2
                            })}
                            onClick={e => toggleNavs(e, 2)}
                            href="#params"
                            role="tab"
                        >
                            <i className="ni ni-settings-gear-65 mr-2" />
                            Paramètres
                        </NavLink>
                    </NavItem>
                    {token.getType() !==0 && <NavItem>
                        <NavLink
                            aria-selected={tabs === 3}
                            className={classnames("mb-sm-3 mb-md-0", {
                                active: tabs === 3
                            })}
                            onClick={e => toggleNavs(e,  3)}
                            href="#organisateur"
                            role="tab"
                        >
                            <i className="ni ni-calendar-grid-58 mr-2" />
                            Organisateurs
                        </NavLink>
                    </NavItem>}
                </Nav>
            </div>
            <Card className="shadow">
                <CardBody>
                    <TabContent activeTab={"tabs" + tabs}>
                        <TabPane tabId="tabs1">
                            <ProfilePane/>
                        </TabPane>
                        <TabPane tabId="tabs2">
                            <ParamPane/>

                        </TabPane>
                        {token.getType() !==0 && <TabPane tabId="tabs3">
                            <p className="description">
                                Raw denim you probably haven't heard of them jean shorts
                                Austin. Nesciunt tofu stumptown aliqua, retro synth master
                                cleanse. Mustache cliche tempor, williamsburg carles vegan
                                helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher
                                synth.
                            </p>
                        </TabPane>}
                    </TabContent>
                </CardBody>
            </Card>
        </>
    )
}
export default NavAccount
