import './assets/css/App.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/font-awesome/css/font-awesome.min.css';
import 'assets/scss/argon-design-system-react.scss';
import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom';
import token from "./utils/token"

import {useHistory} from 'react-router-dom';

import Navigation from './components/navigation/Navigation';
import Footer from './components/footer/Footer';

// Pages of the application
import Home from './views/Home';
import FestivalChoice from "./views/FestivalChoice";
import AllGames from "./views/AllGames";
import Login from "./views/Login";
import Persons from "./views/Persons";
import PersonDetails from "./views/PersonDetails";
import Zones from "./views/Zones"
import Reservations from "./views/Reservations"
import ReservationDetail from "./views/ReservationDetail"
import Account from "./views/Account";
import EditorsGames from "./views/EditorsGames";

import axios from "axios";
import Facturation from "./views/Facturation";

function App() {

    const history = useHistory()
    axios.interceptors.request.use(async (config) => {
        const accessToken = config.headers.Authorization
        let exp;
        try {
            exp = token.getTokenExp(accessToken)
        } catch (e) {
            exp = 0
        }
        let now = new Date().getTime() / 1000
        if (exp < (now + 5)) {
            const refreshToken = token.getRefreshToken()
            await axios.post("/api/token", {token: refreshToken})
                .then(async (res) => {
                    await token.setToken(res.data.accessToken)
                    await token.setRefreshToken(res.data.refreshToken)
                    config.headers.Authorization = res.data.accessToken
                })

        }
        return config
    }, (err) => {
        return Promise.reject(err)
    })


    return (
        <div className="App">

            <header className="App-header">
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </header>

            <Navigation history={history}/>
            <div id="firstDiv" className="minHeight">
                <Switch>
                    <Route path="/Accueil" exact component={Home}/>
                    {token.getType() !== 2 ?
                        <Route path="/ChoixFestival" exact component={FestivalChoice}/>
                        :
                        <Route path="/ChoixFestival" exact><Redirect to="/Connexion"/></Route>
                    }

                    <Route path="/Zones" exact component={Zones}/>
                    <Route path="/ListeJeux" exact component={AllGames}/>
                    <Route path="/JeuxEditeurs" exact component={EditorsGames}/>

                    {token.getType() !== 2 ?
                        <Route path="/Reservations" exact component={Reservations}/>
                        :
                        <Route path="/Reservations" exact><Redirect to="/Connexion"/></Route>
                    }

                    {token.getType() !== 2 ?
                        <Route path="/Facturation" exact component={Facturation}/>
                        :
                        <Route path="/Facturation" exact><Redirect to="/Connexion"/></Route>
                    }
                    {token.getType() !== 2 ?
                        <Route path="/Reservations/:id" exact component={ReservationDetail}/>
                        :
                        <Route path="/Reservations/:id" exact><Redirect to="/Connexion"/></Route>
                    }

                    {token.getType() !== 2 ?
                        <Route path="/Editeurs" exact component={(props) =>
                            <Persons {...props} type={1}/>
                        }/>
                        :
                        <Route path="/Editeurs" exact><Redirect to="/Connexion"/></Route>
                    }


                    {token.getType() !== 2 ?
                        <Route path="/Connexion" exact><Redirect to="/Accueil"/></Route>
                        :
                        <Route path="/Connexion" exact component={Login}/>
                    }

                    {token.getType() !== 2 ?
                        <Route path="/Exposants" exact component={(props) =>
                            <Persons {...props} type={0}/>
                        }/>
                        :
                        <Route path="/Exposants" exact><Redirect to="/Connexion"/></Route>
                    }


                    {token.getType() !== 2 ?
                        <Route path="/Editeurs/:idPerson" exact
                               component={(props) => <PersonDetails {...props} type={1}/>}/>

                        :
                        <Route path="/Editeurs/:idPerson" exact><Redirect to="/Connexion"/></Route>
                    }
                    {token.getType() !== 2 ?
                        <Route path="/Exposants/:idPerson" exact
                               component={(props) => <PersonDetails {...props} type={0}/>}/>

                        :
                        <Route path="/Exposants/:idPerson" exact><Redirect to="/Connexion"/></Route>
                    }
                    {token.getType() !== 2 ?
                        <Route path="/compte" exact component={Account}/>

                        :
                        <Route path="/compte" exact><Redirect to="/Connexion"/></Route>
                    }
                    <Route path="/login" exact component={Login}/>

                    <Route path="/"><Redirect to="/Accueil"/></Route>
                </Switch>

            </div>
            <Footer/>
        </div>
    );
}

export default App;
